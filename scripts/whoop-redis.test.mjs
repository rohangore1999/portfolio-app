import test from 'node:test';
import assert from 'node:assert/strict';
import { randomBytes } from 'node:crypto';
import { encryptTokens, decryptTokens, redisTokenStore, redisPreviewStore, PREVIEW_KEY, PREVIEW_TTL_SECONDS, withRedisConnection, redisClient } from '../src/lib/whoop-redis.mjs';

const env = { UPSTASH_REDIS_REST_URL: 'https://example.upstash.io', UPSTASH_REDIS_REST_TOKEN: 'test-only', WHOOP_TOKEN_ENCRYPTION_KEY: randomBytes(32).toString('base64') };
const tokens = { access_token: 'test-access', refresh_token: 'test-refresh', expires_at: 123 };
function mockRedis() {
  const entries = new Map();
  const fetcher = async (_url, request) => {
    const [operation, ...args] = JSON.parse(request.body);
    let result;
    if (operation === 'GET') result = entries.get(args[0]) ?? null;
    if (operation === 'SET') {
      result = entries.has(args[0]) ? null : 'OK';
      if (result) entries.set(args[0], args[1]);
    }
    if (operation === 'EVAL') {
      const [script, count, ...rest] = args;
      const keys = rest.slice(0, count), values = rest.slice(count);
      result = entries.get(keys[0]) === values[0] ? 1 : 0;
      if (result && script.includes("'DEL'")) entries.delete(keys[0]);
      if (result && count === 2) entries.set(keys[1], values[1]);
    }
    return { ok: true, json: async () => ({ result }) };
  };
  return { entries, fetcher };
}
test('tokens are encrypted with unique IVs and reject tampering or wrong keys', () => {
  const ciphertext = encryptTokens(tokens, env);
  assert.ok(!ciphertext.includes(tokens.refresh_token));
  assert.notEqual(ciphertext, encryptTokens(tokens, env));
  assert.deepEqual(decryptTokens(ciphertext, env), tokens);
  const altered = JSON.parse(ciphertext);
  altered.body = Buffer.from('tampered').toString('base64');
  assert.throws(() => decryptTokens(JSON.stringify(altered), env), /token_decryption_failed/);
  assert.throws(() => decryptTokens(ciphertext, { ...env, WHOOP_TOKEN_ENCRYPTION_KEY: randomBytes(32).toString('base64') }), /token_decryption_failed/);
});
test('writes require ownership and persist encrypted replacement tokens', async () => {
  const { entries, fetcher } = mockRedis();
  const store = redisTokenStore(env, fetcher);
  await assert.rejects(store.save(tokens), /whoop_lock_required/);
  await withRedisConnection(async () => {
    assert.equal(await store.read(), null);
    await store.save(tokens);
    await store.save({ ...tokens, refresh_token: 'rotated-refresh' });
    assert.equal((await store.read()).refresh_token, 'rotated-refresh');
  }, env, fetcher);
  assert.equal(entries.size, 1);
  assert.ok(![...entries.values()][0].includes('rotated-refresh'));
});
test('a lost lock cannot overwrite tokens or delete a new owner lock', async () => {
  const { entries, fetcher } = mockRedis();
  const store = redisTokenStore(env, fetcher);
  await withRedisConnection(async () => {
    await store.save(tokens);
    entries.set('whoop:owner:lock:v1', 'different-owner');
    await assert.rejects(store.save({ ...tokens, refresh_token: 'stale' }), /whoop_lock_lost/);
  }, env, fetcher);
  assert.equal(entries.get('whoop:owner:lock:v1'), 'different-owner');
  assert.deepEqual(await store.read(), tokens);
});
test('configuration and service failures fail closed', async () => {
  assert.throws(() => redisClient({ ...env, UPSTASH_REDIS_REST_TOKEN: '' }), /missing_redis_configuration/);
  assert.throws(() => redisClient({ ...env, WHOOP_TOKEN_ENCRYPTION_KEY: 'bad' }), /invalid_token_encryption_key/);
  await assert.rejects(redisClient(env, async () => ({ ok: false }))(['GET', 'anything']), /redis_storage_unavailable/);
});
test('summary writes use a separate key with a six-hour Redis TTL and require a lock', async () => {
  const { fetcher, entries } = mockRedis();
  const commands = [];
  const recordingFetch = async (url, request) => {
    commands.push(JSON.parse(request.body));
    return fetcher(url, request);
  };
  const store = redisPreviewStore(env, recordingFetch);
  const entry = { v: 1, cachedAt: 123, data: { sleep: 8 } };
  await assert.rejects(store.save(entry), /whoop_lock_required/);
  await withRedisConnection(() => store.save(entry), env, recordingFetch);
  assert.deepEqual(await store.read(), entry);
  const save = commands.find(command => command[0] === 'EVAL' && command[4] === PREVIEW_KEY);
  assert.ok(save[1].includes("'EX'"));
  assert.equal(save.at(-1), PREVIEW_TTL_SECONDS);
  assert.equal(PREVIEW_TTL_SECONDS, 21600);
  assert.equal(entries.has('whoop:owner:tokens:v1'), false);
});

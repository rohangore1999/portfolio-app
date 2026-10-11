import { createCipheriv, createDecipheriv, randomBytes } from 'node:crypto';
import { AsyncLocalStorage } from 'node:async_hooks';

const ownerContext = new AsyncLocalStorage();
// Redis stores one encrypted WHOOP token record at TOKEN_KEY. The encrypted JSON
// contains access_token, refresh_token, scope, and expires_at. It does not store
// measurements in this token record. PREVIEW_KEY separately caches the summary
// shown on the homepage. LOCK_KEY is a short-lived coordination lock.
const TOKEN_KEY = 'whoop:owner:tokens:v1';
export const PREVIEW_KEY = 'whoop:owner:preview:v1';
export const PREVIEW_TTL_SECONDS = 6 * 60 * 60;
const LOCK_KEY = 'whoop:owner:lock:v1';
const LEASE_MS = 120000;
const releaseScript = "if redis.call('GET',KEYS[1]) == ARGV[1] then return redis.call('DEL',KEYS[1]) else return 0 end";
const renewScript = "if redis.call('GET',KEYS[1]) == ARGV[1] then return redis.call('PEXPIRE',KEYS[1],ARGV[2]) else return 0 end";
const saveScript = "if redis.call('GET',KEYS[1]) == ARGV[1] then redis.call('SET',KEYS[2],ARGV[2]); return 1 else return 0 end";
const cacheScript = "if redis.call('GET',KEYS[1]) == ARGV[1] then redis.call('SET',KEYS[2],ARGV[2],'EX',ARGV[3]); return 1 else return 0 end";

export function redisConfigured(env = process.env) {
  return Boolean(env.UPSTASH_REDIS_REST_URL || env.UPSTASH_REDIS_REST_TOKEN);
}
function encryptionKey(env) {
  // Keep this key in server environment variables, separately from Redis. Losing
  // or changing it means the encrypted token record can no longer be decrypted.
  const encoded = env.WHOOP_TOKEN_ENCRYPTION_KEY;
  const key = Buffer.from(encoded || '', 'base64');
  if (key.length !== 32 || key.toString('base64') !== encoded) throw new Error('invalid_token_encryption_key');
  return key;
}
export function encryptTokens(tokens, env = process.env) {
  // AES-GCM protects the complete token record before it leaves this server.
  const iv = randomBytes(12);
  const cipher = createCipheriv('aes-256-gcm', encryptionKey(env), iv);
  cipher.setAAD(Buffer.from(TOKEN_KEY));
  const body = Buffer.concat([cipher.update(JSON.stringify(tokens), 'utf8'), cipher.final()]);
  return JSON.stringify({ v: 1, iv: iv.toString('base64'), tag: cipher.getAuthTag().toString('base64'), body: body.toString('base64') });
}
export function decryptTokens(encoded, env = process.env) {
  try {
    const payload = JSON.parse(encoded);
    if (payload.v !== 1) throw new Error();
    const decipher = createDecipheriv('aes-256-gcm', encryptionKey(env), Buffer.from(payload.iv, 'base64'));
    decipher.setAAD(Buffer.from(TOKEN_KEY));
    decipher.setAuthTag(Buffer.from(payload.tag, 'base64'));
    return JSON.parse(Buffer.concat([decipher.update(Buffer.from(payload.body, 'base64')), decipher.final()]).toString('utf8'));
  } catch { throw new Error('token_decryption_failed'); }
}
export function redisClient(env = process.env, fetcher = fetch) {
  const url = new URL(env.UPSTASH_REDIS_REST_URL || 'https://invalid.invalid');
  if (!env.UPSTASH_REDIS_REST_URL || !env.UPSTASH_REDIS_REST_TOKEN || url.protocol !== 'https:' || url.username || url.password || url.search || url.hash) throw new Error('missing_redis_configuration');
  encryptionKey(env);
  return async command => {
    try {
      const response = await fetcher(url, { method: 'POST', headers: { Authorization: `Bearer ${env.UPSTASH_REDIS_REST_TOKEN}`, 'Content-Type': 'application/json' }, body: JSON.stringify(command), cache: 'no-store', signal: AbortSignal.timeout(10000) });
      if (!response.ok) throw new Error();
      const payload = await response.json();
      if (payload.error || !Object.hasOwn(payload, 'result')) throw new Error();
      return payload.result;
    } catch { throw new Error('redis_storage_unavailable'); }
  };
}
export async function withRedisConnection(operation, env = process.env, fetcher = fetch) {
  const command = redisClient(env, fetcher);
  const owner = randomBytes(24).toString('hex');
  const deadline = Date.now() + 15000;
  while (await command(['SET', LOCK_KEY, owner, 'NX', 'PX', LEASE_MS]) !== 'OK') {
    if (Date.now() >= deadline) throw new Error('whoop_connection_busy');
    await new Promise(resolve => setTimeout(resolve, 200));
  }
  let lost = false;
  const timer = setInterval(() => {
    command(['EVAL', renewScript, 1, LOCK_KEY, owner, LEASE_MS]).then(result => { if (result !== 1) lost = true; }).catch(() => { lost = true; });
  }, 30000);
  timer.unref?.();
  try {
    return await ownerContext.run({ owner, assertLease: () => { if (lost) throw new Error('whoop_lock_lost'); } }, operation);
  } finally {
    clearInterval(timer);
    await command(['EVAL', releaseScript, 1, LOCK_KEY, owner]).catch(() => {});
  }
}
export function redisTokenStore(env = process.env, fetcher = fetch) {
  const command = redisClient(env, fetcher);
  return {
    async read() {
      // Upstash returns ciphertext; only this server can decrypt it with the key.
      ownerContext.getStore()?.assertLease();
      const payload = await command(['GET', TOKEN_KEY]);
      return payload === null ? null : decryptTokens(payload, env);
    },
    async save(tokens) {
      // Save new access/refresh tokens together under the refresh lock because
      // WHOOP rotates both as a pair.
      const context = ownerContext.getStore();
      if (!context) throw new Error('whoop_lock_required');
      context.assertLease();
      const saved = await command(['EVAL', saveScript, 2, LOCK_KEY, TOKEN_KEY, context.owner, encryptTokens(tokens, env)]);
      if (saved !== 1) throw new Error('whoop_lock_lost');
    },
  };
}

// Only the curated summary is cached here, never credentials or raw API records.
// Redis expires this separate entry after six hours; token storage has no TTL.
export function redisPreviewStore(env = process.env, fetcher = fetch) {
  const command = redisClient(env, fetcher);
  return {
    async read() {
      const encoded = await command(['GET', PREVIEW_KEY]);
      if (encoded === null) return null;
      try { return JSON.parse(encoded); } catch { return null; }
    },
    async save(entry) {
      const context = ownerContext.getStore();
      if (!context) throw new Error('whoop_lock_required');
      context.assertLease();
      const saved = await command(['EVAL', cacheScript, 2, LOCK_KEY, PREVIEW_KEY, context.owner, JSON.stringify(entry), PREVIEW_TTL_SECONDS]);
      if (saved !== 1) throw new Error('whoop_lock_lost');
    },
  };
}

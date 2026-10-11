import test from 'node:test';
import assert from 'node:assert/strict';
import { createPreviewLoader } from '../src/lib/whoop-cache.mjs';
import { PREVIEW_TTL_SECONDS } from '../src/lib/whoop-redis.mjs';

function setup() {
  let time = 1000, entry, calls = 0, pending = Promise.resolve();
  const store = { read: async () => entry, save: async value => { entry = value; } };
  const serialize = operation => {
    const result = pending.then(operation);
    pending = result.catch(() => {});
    return result;
  };
  const options = { store, serialize, now: () => time, load: async () => ({ syncedAt: String(time), sleep: ++calls }) };
  return { options, setTime: value => { time = value; }, entry: () => entry, calls: () => calls };
}
test('different loader instances reuse a persisted summary until the six-hour boundary', async () => {
  const state = setup();
  const first = await createPreviewLoader(state.options)();
  state.setTime(1000 + PREVIEW_TTL_SECONDS * 1000 - 1);
  assert.deepEqual(await createPreviewLoader(state.options)(), first);
  assert.equal(state.calls(), 1);
  state.setTime(1000 + PREVIEW_TTL_SECONDS * 1000);
  assert.equal((await createPreviewLoader(state.options)()).sleep, 2);
});
test('concurrent cache misses share a refresh after rechecking under the lock', async () => {
  const state = setup();
  const results = await Promise.all(Array.from({ length: 8 }, () => createPreviewLoader(state.options)()));
  assert.equal(state.calls(), 1);
  assert.ok(results.every(result => result.sleep === 1));
});
test('a failed refresh does not replace the previous cached summary', async () => {
  const state = setup();
  await createPreviewLoader(state.options)();
  const previous = state.entry();
  state.setTime(1000 + PREVIEW_TTL_SECONDS * 1000);
  await assert.rejects(createPreviewLoader({ ...state.options, load: async () => { throw new Error('whoop_fetch_failed'); } })(), /whoop_fetch_failed/);
  assert.equal(state.entry(), previous);
});

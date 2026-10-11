import { serialConnection } from './whoop.mjs';
import { fetchWhoopPreview } from './whoop-preview.mjs';
import { redisConfigured, redisPreviewStore, PREVIEW_TTL_SECONDS } from './whoop-redis.mjs';

export function createPreviewLoader({ store, load = fetchWhoopPreview, serialize = serialConnection, now = Date.now } = {}) {
  let memory;
  const storage = () => store ?? (redisConfigured() ? redisPreviewStore() : {
    read: async () => memory,
    save: async entry => { memory = entry; },
  });
  const fresh = entry => entry?.v === 1 && Number.isFinite(entry.cachedAt) &&
    now() >= entry.cachedAt && now() - entry.cachedAt < PREVIEW_TTL_SECONDS * 1000 &&
    entry.data && typeof entry.data === 'object';
  return async () => {
    const cache = storage();
    const existing = await cache.read();
    if (fresh(existing)) return existing.data;
    return serialize(async () => {
      // Another instance may have refreshed while this request waited for the lock.
      const latest = await cache.read();
      if (fresh(latest)) return latest.data;
      const data = await load();
      await cache.save({ v: 1, cachedAt: now(), data });
      return data;
    });
  };
}

export const getWhoopPreview = createPreviewLoader();

import path from 'node:path';
import { tokenStore } from '../src/lib/whoop.mjs';
import { redisTokenStore, withRedisConnection } from '../src/lib/whoop-redis.mjs';

try {
  await withRedisConnection(async () => {
    const destination = redisTokenStore();
    if (await destination.read()) {
      console.log('Redis already contains WHOOP tokens; existing tokens preserved.');
      return;
    }
    const tokens = await tokenStore(path.join(process.cwd(), '.whoop')).read();
    if (!tokens?.access_token || !tokens?.refresh_token) throw new Error('local_tokens_missing');
    await destination.save(tokens);
    const saved = await destination.read();
    if (JSON.stringify(saved) !== JSON.stringify(tokens)) throw new Error('migration_verification_failed');
    console.log('WHOOP tokens encrypted, saved in Redis, and verified.');
  });
} catch (error) {
  const safeErrors = new Set(['local_tokens_missing', 'migration_verification_failed', 'redis_storage_unavailable', 'missing_redis_configuration', 'invalid_token_encryption_key', 'token_decryption_failed', 'whoop_connection_busy', 'whoop_lock_lost']);
  console.error(safeErrors.has(error.message) ? error.message : 'token_migration_failed');
  process.exitCode = 1;
}

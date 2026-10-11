# WHOOP connection test

This first step connects the owner's account locally. It does not publish health data or modify the homepage. All setup routes return 404 in production.

1. Sign in to https://developer-dashboard.whoop.com using your WHOOP account.
2. Create an app named **Rohan Gore Portfolio**. Enable `read:sleep`, `read:recovery`, `read:cycles`, and `read:workout`.
3. Register `http://127.0.0.1:3000/api/whoop/callback` exactly. Open the local website using 127.0.0.1, not localhost, so the OAuth cookie matches. If WHOOP rejects HTTP callbacks, use an HTTPS development URL and set the callback and browser origin to that URL; the development routes currently permit loopback hosts only, so an external tunnel needs an explicit access-control change first.
4. Set these **server-only** values in `.env.local` (never use NEXT_PUBLIC for credentials):

```dotenv
WHOOP_CLIENT_ID=
WHOOP_CLIENT_SECRET=
WHOOP_REDIRECT_URI=http://127.0.0.1:3000/api/whoop/callback
```

5. Run `npm run dev` and open http://127.0.0.1:3000/whoop/setup.
6. Click **Connect WHOOP**, sign in, and authorize the four read scopes plus `offline` (refresh tokens).
7. Click **Test API access**, then **Test token refresh**. Each should report connected for sleep, recovery, cycles, and workouts. An empty collection is a successful connection with no records yet.

Credentials never enter browser JavaScript. The callback validates an eight-character OAuth state stored in a ten-minute HttpOnly cookie. Local tokens are written atomically to `.whoop/tokens.json` (directory 0700, file 0600), excluded from Git. Both replacement tokens are saved after refresh; local token operations are serialized. Test responses expose only request success and record presence, not token values or physiological measurements. Do not run concurrent development servers against the same token store.

Before enabling production endpoints, add owner authentication. Local files are unsuitable for Vercel/serverless persistence. Scheduled syncing and public, selected metrics are later steps.

## Persistent tokens with Upstash

Create a Free Redis database with Mumbai (`ap-south-1`) as primary and eviction disabled. Add these server-only values to `.env.local` and to Vercel's production environment variables:

```dotenv
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
WHOOP_TOKEN_ENCRYPTION_KEY=
```

The encryption key is a random 32-byte key encoded as base64. Use the exact same existing key on Vercel: changing it makes saved tokens unreadable. Never use `NEXT_PUBLIC_` for these variables or commit credentials. Keep the key separately from Redis. WHOOP client credentials are also still required on the server.

Run `node --env-file=.env.local scripts/whoop-migrate-redis.mjs` once to transfer the local connection. This preserves an existing Redis connection and verifies the encrypted record after migration. It leaves the local file in place; after the first Redis refresh, that local token pair is stale and must not be restored over Redis.

When Redis is configured, token reads and writes use Redis. AES-256-GCM encrypts the stored pair, and a distributed owner lock serializes token refreshes across server instances. Each replacement pair is saved before fetching metrics. Partial Redis configuration and storage errors fail closed rather than falling back to a local file. Production requires persistent storage. The setup and public preview endpoints remain disabled in production until their access controls and production data flow are implemented.

After adding Vercel variables, redeploy for them to take effect. Restart the local development server if it has not picked up updated environment variables. Validate storage with `node --test scripts/whoop-redis.test.mjs scripts/whoop.test.mjs scripts/whoop-preview.test.mjs`.

Official references: [OAuth](https://developer.whoop.com/docs/developing/oauth/), [app registration](https://developer.whoop.com/docs/developing/getting-started/), [v2 API](https://developer.whoop.com/api/).

## Homepage preview

The homepage shows a local-only WHOOP panel beneath the routine statement in development. It fetches a curated summary through POST `/api/whoop/preview`, guarded by loopback host and same-origin checks. Production omits the panel and returns 404 for this API. The curated summary and graph points are cached in Redis for six hours under `whoop:owner:preview:v1`, separately from encrypted tokens. Redis removes this summary automatically at expiry. The next request fetches a new rolling 30-day summary; expiry does not schedule a background sync. Cache hits skip WHOOP and the refresh lock. Cache misses recheck the cache under the distributed lock so simultaneous requests share one refresh. Failed WHOOP requests do not save a new cache entry. Without Redis in local development, the same six-hour policy uses memory. The summary includes its original `syncedAt` timestamp; current-day metrics may change at WHOOP before the next refresh. The panel displays rolling 30-day averages for non-nap sleep, matched recovery, and completed-cycle strain, 30-day sleep, recovery, and strain graphs with immediate date/value tooltips, keyboard arrow navigation, and reduced-motion-aware bar animations. The workout activity strip has been removed from the card. Dates use Asia/Kolkata. Missing records are separate from days without recorded workouts. No tokens or raw recovery biomarkers reach the browser.

Validation: `node --test scripts/whoop.test.mjs scripts/whoop-preview.test.mjs`.

Cache validation: `node --test scripts/whoop-cache.test.mjs scripts/whoop-redis.test.mjs scripts/whoop.test.mjs scripts/whoop-preview.test.mjs`.

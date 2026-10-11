import { redisConfigured, redisTokenStore, withRedisConnection } from "./whoop-redis.mjs";
import { randomBytes, timingSafeEqual } from "node:crypto";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";

export const WHOOP_SCOPES = ["read:sleep", "read:recovery", "read:cycles", "read:workout", "offline"];
export const WHOOP_RESOURCES = {
  sleep: "activity/sleep",
  recovery: "recovery",
  cycles: "cycle",
  workouts: "activity/workout",
};
const TOKEN_URL = "https://api.prod.whoop.com/oauth/oauth2/token";
const API_URL = "https://api.prod.whoop.com/developer/v2/";

export function configuration(env = process.env) {
  const clientId = env.WHOOP_CLIENT_ID;
  const clientSecret = env.WHOOP_CLIENT_SECRET;
  const redirectUri = env.WHOOP_REDIRECT_URI;
  if (!clientId || !clientSecret || !redirectUri) throw new Error("missing_configuration");
  const url = new URL(redirectUri);
  if (url.username || url.password || url.search || url.hash || url.pathname !== "/api/whoop/callback") {
    throw new Error("invalid_configuration");
  }
  return { clientId, clientSecret, redirectUri };
}

export function requestOrigin(request) {
  const url = new URL(request.url);
  // Next's dev server can normalize request.url to localhost despite a 127.0.0.1 Host.
  const host = request.headers?.get("host") || url.host;
  if (!/^(localhost|127\.0\.0\.1|\[::1\])(:\d+)?$/.test(host)) return null;
  return `${url.protocol}//${host}`;
}

export function isLocalDevelopment(request) {
  return process.env.NODE_ENV === "development" && requestOrigin(request) !== null;
}

export function newState() {
  // WHOOP requires an eight-character state. It is bound to a short-lived HttpOnly cookie.
  return randomBytes(6).toString("base64url");
}

export function validState(expected, actual) {
  return typeof expected === "string" && typeof actual === "string" &&
    /^[A-Za-z0-9_-]{8}$/.test(expected) && /^[A-Za-z0-9_-]{8}$/.test(actual) &&
    timingSafeEqual(Buffer.from(expected), Buffer.from(actual));
}

export function authorizationUrl(config, state) {
  const url = new URL("https://api.prod.whoop.com/oauth/oauth2/auth");
  url.search = new URLSearchParams({
    response_type: "code", client_id: config.clientId,
    redirect_uri: config.redirectUri, scope: WHOOP_SCOPES.join(" "), state,
  }).toString();
  return url.toString();
}

export async function requestTokens(config, grant, fetcher = fetch) {
  const response = await fetcher(TOKEN_URL, {
    method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ ...grant, client_id: config.clientId, client_secret: config.clientSecret }),
    cache: "no-store", signal: AbortSignal.timeout(15000),
  });
  if (!response.ok) throw new Error("token_exchange_failed");
  const data = await response.json();
  const granted = new Set((data.scope || "").split(/\s+/));
  if (!data.access_token || !data.refresh_token || !Number.isFinite(data.expires_in) || data.expires_in <= 0 ||
    WHOOP_SCOPES.some(scope => !granted.has(scope))) throw new Error("invalid_token_response");
  return {
    access_token: data.access_token, refresh_token: data.refresh_token,
    scope: data.scope, expires_at: Date.now() + data.expires_in * 1000,
  };
}

export function tokenStore(directory) {
  if (!directory && redisConfigured()) return redisTokenStore();
  if (!directory && process.env.NODE_ENV === "production") throw new Error("persistent_token_storage_required");
  directory ||= path.join(process.cwd(), ".whoop");
  const filename = path.join(directory, "tokens.json");
  return {
    async read() {
      try { return JSON.parse(await readFile(filename, "utf8")); }
      catch (error) { if (error.code === "ENOENT") return null; throw new Error("token_storage_failed"); }
    },
    async save(tokens) {
      await mkdir(directory, { recursive: true, mode: 0o700 });
      const temporary = path.join(directory, `${randomBytes(8).toString("hex")}.tmp`);
      await writeFile(temporary, JSON.stringify(tokens), { mode: 0o600, flag: "wx" });
      await rename(temporary, filename);
    },
  };
}

// Serialize local tests and refreshes: WHOOP rotates both tokens on refresh.
let pending = Promise.resolve();
export function serialConnection(operation) {
  const result = pending.then(() => redisConfigured() ? withRedisConnection(operation) : operation());
  pending = result.catch(() => {});
  return result;
}

export async function testConnection(config, store, { forceRefresh = false, fetcher = fetch } = {}) {
  let tokens = await store.read();
  if (!tokens) throw new Error("not_connected");
  let refreshed = false;
  if (forceRefresh || tokens.expires_at <= Date.now() + 60000) {
    tokens = await requestTokens(config, { grant_type: "refresh_token", refresh_token: tokens.refresh_token, scope: "offline" }, fetcher);
    // Persist the replacement refresh token before making any data requests.
    await store.save(tokens);
    refreshed = true;
  }
  const results = await Promise.all(Object.entries(WHOOP_RESOURCES).map(async ([name, endpoint]) => {
    const response = await fetcher(`${API_URL}${endpoint}?limit=1`, {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
      cache: "no-store", signal: AbortSignal.timeout(15000),
    });
    if (!response.ok) return { name, ok: false, status: response.status };
    const data = await response.json();
    if (!Array.isArray(data.records)) return { name, ok: false, status: "invalid_response" };
    // Report connectivity only; never return credentials or personal metric values.
    return { name, ok: true, recordsReturned: data.records.length };
  }));
  return { refreshed, results };
}

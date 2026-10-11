import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, rm, stat } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import {
  authorizationUrl, configuration, isLocalDevelopment, newState,
  requestOrigin, requestTokens, serialConnection, testConnection, tokenStore, validState, WHOOP_SCOPES,
} from "../src/lib/whoop.mjs";

const config = { clientId: "test-client", clientSecret: "test-secret", redirectUri: "http://127.0.0.1:3000/api/whoop/callback" };
const tokenResponse = {
  access_token: "test-access", refresh_token: "test-refresh",
  expires_in: 3600, scope: WHOOP_SCOPES.join(" "),
};

test("authorization requests exactly the required scopes, offline, and registered callback", () => {
  const state = newState();
  assert.equal(state.length, 8);
  const url = new URL(authorizationUrl(config, state));
  assert.equal(url.origin, "https://api.prod.whoop.com");
  assert.equal(url.searchParams.get("redirect_uri"), config.redirectUri);
  assert.equal(url.searchParams.get("scope"), WHOOP_SCOPES.join(" "));
  assert.equal(url.searchParams.get("state"), state);
  assert.equal(url.searchParams.has("client_secret"), false);
});

test("invalid, missing, mismatched, and Unicode states are rejected without throwing", () => {
  assert.equal(validState("abcdefgh", "abcdefgh"), true);
  for (const value of [null, "", "abcdefgi", "short", "éééééééé", "abcdefghX"]) {
    assert.equal(validState("abcdefgh", value), false);
  }
});

test("credentials and malformed callback configurations fail closed", () => {
  assert.throws(() => configuration({}), /missing_configuration/);
  assert.throws(() => configuration({ WHOOP_CLIENT_ID: "id", WHOOP_CLIENT_SECRET: "secret", WHOOP_REDIRECT_URI: "http://localhost/wrong" }), /invalid_configuration/);
});

test("localhost normalization preserves the browser origin and rejects external Host headers", () => {
  assert.equal(requestOrigin({ url: "http://localhost:3000/api/whoop/test", headers: new Headers({ host: "127.0.0.1:3000" }) }), "http://127.0.0.1:3000");
  assert.equal(requestOrigin({ url: config.redirectUri, headers: new Headers({ host: "example.com" }) }), null);
});

test("setup endpoints are disabled in production and for non-loopback development hosts", () => {
  const previous = process.env.NODE_ENV;
  try {
    process.env.NODE_ENV = "production";
    assert.equal(isLocalDevelopment({ url: config.redirectUri }), false);
    process.env.NODE_ENV = "development";
    assert.equal(isLocalDevelopment({ url: config.redirectUri }), true);
    assert.equal(isLocalDevelopment({ url: "https://www.rohangore.com/api/whoop/test" }), false);
  } finally { process.env.NODE_ENV = previous; }
});

test("token exchange checks scope completeness and never exposes WHOOP error bodies", async () => {
  const tokens = await requestTokens(config, { grant_type: "authorization_code", code: "test-code", redirect_uri: config.redirectUri }, async (url, options) => {
    assert.equal(url, "https://api.prod.whoop.com/oauth/oauth2/token");
    assert.equal(options.body.get("client_secret"), config.clientSecret);
    assert.equal(options.body.get("redirect_uri"), config.redirectUri);
    return Response.json(tokenResponse);
  });
  assert.equal(tokens.refresh_token, "test-refresh");
  assert.ok(tokens.expires_at > Date.now());
  await assert.rejects(requestTokens(config, {}, async () => new Response("sensitive provider body", { status: 401 })), /^Error: token_exchange_failed$/);
  await assert.rejects(requestTokens(config, {}, async () => Response.json({ ...tokenResponse, scope: "read:sleep" })), /invalid_token_response/);
});

test("local storage is restricted and replacement tokens persist", async () => {
  const directory = await mkdtemp(path.join(tmpdir(), "whoop-test-"));
  try {
    const store = tokenStore(directory);
    assert.equal(await store.read(), null);
    await store.save({ access_token: "first", refresh_token: "first-refresh" });
    await store.save({ access_token: "second", refresh_token: "second-refresh" });
    assert.equal((await store.read()).refresh_token, "second-refresh");
    assert.equal((await stat(path.join(directory, "tokens.json"))).mode & 0o777, 0o600);
  } finally { await rm(directory, { recursive: true, force: true }); }
});

test("refresh persists rotated tokens before querying all four endpoints; test output omits metrics", async () => {
  let saved = false;
  const store = {
    read: async () => ({ access_token: "old", refresh_token: "old-refresh", expires_at: 0 }),
    save: async tokens => { assert.equal(tokens.refresh_token, "test-refresh"); saved = true; },
  };
  const calls = [];
  const result = await testConnection(config, store, { fetcher: async (url, options) => {
    calls.push(url);
    if (url.includes("oauth2/token")) {
      assert.equal(options.body.get("refresh_token"), "old-refresh");
      return Response.json(tokenResponse);
    }
    assert.equal(saved, true);
    assert.equal(options.headers.Authorization, "Bearer test-access");
    return Response.json({ records: [{ score: { recovery_score: 75 } }] });
  } });
  assert.equal(calls.length, 5);
  assert.equal(result.refreshed, true);
  assert.equal(result.results.every(item => item.ok), true);
  assert.equal(JSON.stringify(result).includes("test-access"), false);
  assert.equal(JSON.stringify(result).includes("recovery_score"), false);
});

test("failed refresh preserves old tokens and empty data collections remain successful", async () => {
  let saved = false;
  const store = { read: async () => ({ refresh_token: "old", expires_at: Date.now() + 3600000 }), save: async () => { saved = true; } };
  await assert.rejects(testConnection(config, store, { forceRefresh: true, fetcher: async () => new Response(null, { status: 401 }) }), /token_exchange_failed/);
  assert.equal(saved, false);
  const result = await testConnection(config, store, { fetcher: async url => url.includes("recovery") ? new Response(null, { status: 403 }) : Response.json({ records: [] }) });
  assert.equal(result.results.find(item => item.name === "recovery").ok, false);
  assert.equal(result.results.find(item => item.name === "sleep").recordsReturned, 0);
});

test("connection operations are serialized to avoid refresh-token rotation races", async () => {
  const order = [];
  await Promise.all([1, 2].map(id => serialConnection(async () => {
    order.push(`start${id}`);
    await Promise.resolve();
    order.push(`end${id}`);
  })));
  assert.deepEqual(order, ["start1", "end1", "start2", "end2"]);
});

import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { configuration, tokenStore } from "@/lib/whoop.mjs";
import TestConnection from "./TestConnection";

export const dynamic = "force-dynamic";
export const metadata = { title: "WHOOP setup", robots: { index: false, follow: false } };

const errors = {
  configuration: "Set the WHOOP credentials and make sure the callback matches this browser’s origin.",
  state: "The authorization session expired or did not match. Start the connection again.",
  denied: "Authorization was cancelled or no code was returned. You can try again.",
  exchange: "WHOOP authorization could not be saved. Check the app credentials, callback URL, and scopes, then reconnect.",
};

export default async function WhoopSetup({ searchParams }) {
  const host = (await headers()).get("host");
  if (process.env.NODE_ENV !== "development" || !/^(localhost|127\.0\.0\.1|\[::1\])(:\d+)?$/.test(host || "")) notFound();
  const query = await searchParams;
  let configured = false;
  let redirectUri = "http://127.0.0.1:3000/api/whoop/callback";
  try { const config = configuration(); configured = true; redirectUri = config.redirectUri; } catch {}
  const connected = Boolean(await tokenStore().read());
  return <main className="mx-auto max-w-3xl px-6 py-24 text-white">
    <p className="mb-4 text-sm tracking-widest text-orange-500">LOCAL CONNECTION TEST</p>
    <h1 className="mb-6 text-4xl font-semibold">Connect your WHOOP</h1>
    <p className="mb-8 text-white/60">Authorize your account, verify API access, and test automatic token refresh. This page is available only in local development.</p>
    <ol className="mb-8 list-decimal space-y-4 pl-5">
      <li>Create an app in the <a className="text-orange-500 underline" href="https://developer-dashboard.whoop.com" target="_blank" rel="noreferrer">WHOOP Developer Dashboard</a>.</li>
      <li>Enable read:sleep, read:recovery, read:cycles, and read:workout. The authorization request also includes offline.</li>
      <li>Register this exact callback: <code className="break-all text-orange-500">{redirectUri}</code></li>
      <li>Add WHOOP_CLIENT_ID, WHOOP_CLIENT_SECRET, and WHOOP_REDIRECT_URI to .env.local. Keep the secret in that file.</li>
    </ol>
    <p className="mb-4">Credentials: {configured ? "Configured" : "Not configured"} · Account: {connected ? "Connected" : "Not connected"}</p>
    {query.error && <p role="alert" className="mb-6 text-orange-400">{errors[query.error] || "Connection failed. Try again."}</p>}
    {query.connected && connected && <p role="status" className="mb-6 text-green-400">Authorization saved. Run both tests below.</p>}
    <form action="/api/whoop/connect" method="post" className="mb-6">
      <button disabled={!configured} className="rounded-lg bg-orange-500 px-5 py-3 font-semibold text-black disabled:opacity-40">{connected ? "Reconnect WHOOP" : "Connect WHOOP"}</button>
    </form>
    <TestConnection connected={connected} />
    <p className="mt-10 text-sm text-white/50">Tokens stay in the ignored .whoop folder with restricted file permissions. Deploying the integration will need durable private token storage.</p>
  </main>;
}

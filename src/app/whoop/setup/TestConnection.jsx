"use client";

import { useState } from "react";

export default function TestConnection({ connected }) {
  const [result, setResult] = useState(null);
  const [busy, setBusy] = useState(false);
  async function test(refresh) {
    setBusy(true);
    setResult(null);
    try {
      const response = await fetch(`/api/whoop/test${refresh ? "?refresh=1" : ""}`, { method: "POST" });
      setResult(await response.json());
    } catch { setResult({ error: "Unable to run the test. Try again." }); }
    finally { setBusy(false); }
  }
  return <div className="space-y-5">
    <div className="flex flex-wrap gap-3">
      <button disabled={!connected || busy} onClick={() => test(false)} className="rounded-lg border border-white/30 px-5 py-3 disabled:opacity-40">Test API access</button>
      <button disabled={!connected || busy} onClick={() => test(true)} className="rounded-lg border border-white/30 px-5 py-3 disabled:opacity-40">Test token refresh</button>
    </div>
    <div role="status" aria-live="polite">
      {busy && <p>Checking WHOOP…</p>}
      {result?.error && <p>{result.error}</p>}
      {result?.results && <>
        <p>{result.refreshed ? "Token refreshed and saved." : "Using the existing access token."}</p>
        <ul className="mt-3 space-y-2">{result.results.map(item => <li key={item.name}>
          {item.name}: {item.ok ? `Connected${item.recordsReturned ? "" : " (no records yet)"}` : `Failed (${item.status})`}
        </li>)}</ul>
      </>}
    </div>
  </div>;
}

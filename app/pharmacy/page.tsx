"use client";

import { FormEvent, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { useWallet } from "@/hooks/useWallet";
import type { FillRecord } from "@/lib/medproof";

export default function PharmacyPage() {
  const wallet = useWallet();
  const [code, setCode] = useState("");
  const [verified, setVerified] = useState<FillRecord | null>(null);

  async function verify(event: FormEvent) {
    event.preventDefault();
    const result = await wallet.verifyFill(code);
    if (result) setVerified(result);
  }

  return (
    <AppShell>
      <main className="clinical-page pharmacy-page">
        <header className="page-intro">
          <div><span className="role-tag pharmacy">Pharmacy</span><h1>Verify medicine release</h1></div>
          <p>No wallet connection required. Check patient’s finalized fill transaction directly against Midnight preprod.</p>
        </header>

        {!verified ? (
          <section className="verify-panel">
            <div className="counter-guide">
              <p className="section-label">At counter</p><h2>Ask patient to tap “Fill prescription”</h2>
              <ol><li>Patient approves one 1AM transaction.</li><li>Patient shows resulting transaction ID.</li><li>Paste ID here and release medicine only after green result.</li></ol>
            </div>
            <form onSubmit={verify} className="verify-form">
              <label className="field"><span>Midnight fill transaction</span><input value={code} onChange={(event) => setCode(event.target.value.toUpperCase())} placeholder="64-character transaction ID" minLength={64} maxLength={64} required autoComplete="off" /></label>
              {wallet.error && <div className="error-banner" role="alert">{wallet.error}</div>}
              <button className="button primary full-button" disabled={wallet.operation !== "idle"}>{wallet.operation === "verifying" ? "Checking Midnight…" : "Verify fill"}</button>
            </form>
          </section>
        ) : (
          <section className="verified-release">
            <div className="release-status"><span>✓</span><div><p className="section-label">Finalized on Midnight</p><h2>Release authorized</h2></div></div>
            <dl className="release-facts"><div><dt>Medicine</dt><dd>{verified.medicine}</dd></div><div><dt>Fill status</dt><dd>Consumed · replay blocked</dd></div><div><dt>Patient identity</dt><dd>Not disclosed</dd></div><div><dt>Transaction</dt><dd className="mono-value">{verified.transactionHash}</dd></div></dl>
            <p className="release-note">This transaction both proved prescription validity and marked its only fill used.</p>
            <button className="button secondary" onClick={() => { setVerified(null); setCode(""); wallet.clearError(); }}>Verify another patient</button>
          </section>
        )}
      </main>
    </AppShell>
  );
}

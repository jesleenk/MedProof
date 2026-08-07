"use client";

import { FormEvent, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { useWallet } from "@/hooks/useWallet";
import type { ProofRecord } from "@/lib/medproof";

export default function PharmacyPage() {
  const wallet = useWallet();
  const [code, setCode] = useState("");
  const [verified, setVerified] = useState<ProofRecord | null>(null);
  const [dispensed, setDispensed] = useState(false);

  async function verify(event: FormEvent) {
    event.preventDefault();
    const result = await wallet.verifyProof(code || wallet.proof?.code || "");
    if (result) setVerified(result);
  }

  async function dispense() {
    const result = await wallet.dispense();
    if (result) setDispensed(true);
  }

  return (
    <AppShell>
      <main className="product-page pharmacy-layout">
        <aside className="context-panel dark-context">
          <p className="eyebrow">Pharmacy terminal</p>
          <h1>Verify proof</h1>
          <p>Confirm right medicine can be dispensed. Patient record remains closed.</p>
          <dl className="disclosure-list"><div><dt>Shown</dt><dd>Medicine · valid now · refill</dd></div><div><dt>Hidden</dt><dd>Identity · doctor · diagnosis · history</dd></div></dl>
        </aside>

        <section className="work-card pharmacy-card">
          {dispensed ? (
            <div className="success-view dispense-success"><span className="success-symbol">✓</span><p className="eyebrow">Dispense recorded</p><h2>Medicine released. Refill closed.</h2><p>One-time nullifier prevents another pharmacy from filling this credential.</p><a className="button secondary" href="/pharmacy">Verify another prescription</a></div>
          ) : !verified ? (
            <form onSubmit={verify} className="verify-form">
              <div className="form-heading"><div><p className="eyebrow">New verification</p><h2>Scan patient proof</h2></div><span>Counter 03</span></div>
              <div className="scanner-window"><div className="scan-corners"><span /><span /><span /><span /></div><div className="scan-line" /><p>Scan QR from patient wallet</p></div>
              <div className="divider"><span>or enter proof transaction</span></div>
              <label className="field full"><span>Midnight transaction ID</span><input value={code || wallet.proof?.code || ""} onChange={(event) => setCode(event.target.value.toUpperCase())} placeholder="64-character transaction ID" required autoComplete="off" /></label>
              {wallet.error && <div className="error-banner" role="alert">{wallet.error}</div>}
              <button className="button primary submit" disabled={wallet.operation !== "idle" || !wallet.connected}>{wallet.operation === "verifying" ? "Checking preprod finality…" : wallet.connected ? "Verify on Midnight" : "Connect 1AM first"}</button>
            </form>
          ) : (
            <div className="verification-result">
              <div className="valid-banner"><span>✓</span><div><small>Proof accepted</small><h2>Valid prescription</h2></div></div>
              <dl className="verify-facts"><div><dt>Medicine</dt><dd>{verified.medicine}</dd></div><div><dt>Valid now</dt><dd className="yes">Yes</dd></div><div><dt>Refills available</dt><dd>{verified.refillsRemaining}</dd></div></dl>
              <div className="protected-fields"><p>Protected fields</p><span>Patient identity</span><span>Doctor identity</span><span>Diagnosis</span><span>Other medication</span></div>
              <button className="button dispense-button" onClick={dispense} disabled={wallet.operation !== "idle" || !wallet.connected}>{wallet.operation === "dispensing" ? "Proving and recording on-chain…" : "Patient authorize dispense"}</button>
            </div>
          )}
        </section>
      </main>
    </AppShell>
  );
}

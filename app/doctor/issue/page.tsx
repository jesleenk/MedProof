"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { useWallet } from "@/hooks/useWallet";
import { SUPPORTED_MEDICINE } from "@/lib/medproof";

export default function IssuePage() {
  const wallet = useWallet();
  const [issued, setIssued] = useState(false);
  const today = new Date().toISOString().slice(0, 10);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const result = await wallet.issuePrescription({
      patientCommitment: String(form.get("patientCommitment")),
      validFrom: String(form.get("validFrom")),
      validUntil: String(form.get("validUntil")),
      privateDirections: String(form.get("privateDirections")),
    });
    if (result) setIssued(true);
  }

  return (
    <AppShell>
      <main className="product-page">
        <aside className="context-panel">
          <p className="eyebrow">Prescriber portal</p>
          <h1>Issue prescription</h1>
          <p>Create patient-held credential. Private directions leave this screen encrypted for patient wallet.</p>
          <div className="privacy-rule"><span>Public ledger</span><strong>Commitment + encrypted payload</strong></div>
          <div className="privacy-rule"><span>Never published</span><strong>Patient, diagnosis, directions</strong></div>
        </aside>

        <section className="work-card">
          {issued && wallet.prescription ? (
            <div className="success-view">
              <span className="success-symbol">✓</span>
              <p className="eyebrow">Prescription issued</p>
              <h2>Credential delivered to patient wallet.</h2>
              <dl className="receipt-list">
                <div><dt>Prescription ID</dt><dd>{wallet.prescription.id}</dd></div>
                <div><dt>Medicine</dt><dd>{wallet.prescription.medicine}</dd></div>
                <div><dt>Refills</dt><dd>1 authorized</dd></div>
                <div><dt>Transaction</dt><dd>{wallet.prescription.transactionHash.slice(0, 22)}…</dd></div>
              </dl>
              <div className="button-row"><Link className="button primary" href="/wallet">Open patient wallet</Link><button className="button secondary" onClick={() => setIssued(false)}>Issue another</button></div>
            </div>
          ) : (
            <form onSubmit={submit}>
              <div className="form-heading"><div><p className="eyebrow">New credential</p><h2>Prescription details</h2></div><span>All fields required</span></div>
              {wallet.error && <div className="error-banner" role="alert">{wallet.error}</div>}
              <label className="field full"><span>Patient wallet commitment</span><input name="patientCommitment" placeholder="64-character commitment" defaultValue={wallet.identity?.commitment ?? ""} autoComplete="off" required /><small>Created in patient wallet. Current browser must hold matching private credential.</small></label>
              <label className="field full"><span>Medicine</span><input value={SUPPORTED_MEDICINE} disabled /><small>Fixed by current contract configuration</small></label>
              <div className="field-grid">
                <label className="field"><span>Valid from</span><input type="date" name="validFrom" defaultValue={today} required /></label>
                <label className="field"><span>Expires</span><input type="date" name="validUntil" required /></label>
              </div>
              <label className="field full"><span>Private patient directions</span><textarea name="privateDirections" rows={4} placeholder="Dose and administration instructions" required /><small>Encrypted for patient. Excluded from public proof.</small></label>
              <div className="fixed-policy"><span>Authorized dispensing</span><strong>1 fill</strong><p>Current contract supports one dispense and blocks replay.</p></div>
              {!wallet.connected && <div className="error-banner">Connect 1AM wallet on preprod before issuing.</div>}
              <button className="button primary submit" disabled={wallet.operation !== "idle" || !wallet.connected || !wallet.identity}>{wallet.operation === "issuing" ? "Proving, signing, and submitting…" : "Issue on Midnight"}</button>
            </form>
          )}
        </section>
      </main>
    </AppShell>
  );
}

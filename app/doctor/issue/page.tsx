"use client";

import { FormEvent, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { useWallet } from "@/hooks/useWallet";
import { SUPPORTED_MEDICINE, type IssuedPrescription } from "@/lib/medproof";

export default function IssuePage() {
  const wallet = useWallet();
  const [issued, setIssued] = useState<IssuedPrescription | null>(null);
  const [copied, setCopied] = useState(false);
  const [tomorrow] = useState(() => new Date(Date.now() + 86_400_000).toISOString().slice(0, 10));

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const result = await wallet.issuePrescription({
      patientRequest: String(form.get("patientRequest")),
      expiresOn: String(form.get("expiresOn")),
      privateDirections: String(form.get("privateDirections")),
    });
    if (result) setIssued(result);
  }

  return (
    <AppShell>
      <main className="clinical-page">
        <header className="page-intro">
          <div><span className="role-tag hospital">Hospital</span><h1>Issue prescription</h1></div>
          <p>Paste patient request, confirm order, approve one Midnight transaction. Only anonymous commitment reaches chain.</p>
        </header>

        {issued ? (
          <section className="task-card success-card">
            <div className="success-mark">✓</div>
            <div className="task-content">
              <p className="section-label">Issued on Midnight</p>
              <h2>Send prescription code to patient</h2>
              <p>Code is encrypted for patient’s request key. Hospital should send it through approved secure messaging.</p>
              <dl className="receipt-list">
                <div><dt>Medicine</dt><dd>{issued.medicine}</dd></div>
                <div><dt>Expires</dt><dd>{issued.expiresOn}</dd></div>
                <div><dt>Transaction</dt><dd>{issued.transactionHash}</dd></div>
              </dl>
              <textarea className="code-box" readOnly rows={5} value={issued.patientPackage} aria-label="Encrypted patient prescription code" />
              <div className="button-row">
                <button className="button primary" onClick={async () => { await navigator.clipboard.writeText(issued.patientPackage); setCopied(true); }}>{copied ? "Code copied" : "Copy patient code"}</button>
                <button className="button secondary" onClick={() => { setIssued(null); setCopied(false); }}>Issue another</button>
              </div>
            </div>
          </section>
        ) : (
          <section className="order-layout">
            <aside className="order-summary">
              <p className="section-label">Contract policy</p>
              <h2>{SUPPORTED_MEDICINE}</h2>
              <dl><div><dt>Authorized fills</dt><dd>1</dd></div><div><dt>Issuer</dt><dd>Hospital wallet</dd></div><div><dt>Patient identity</dt><dd>Hidden</dd></div></dl>
            </aside>
            <form className="order-form" onSubmit={submit}>
              <label className="field"><span>Patient request</span><textarea name="patientRequest" rows={5} placeholder="Paste request from patient" required /><small>New v2 request required. Old request codes are rejected before any transaction.</small></label>
              <div className="form-row">
                <label className="field"><span>Medicine</span><input value={SUPPORTED_MEDICINE} disabled /></label>
                <label className="field"><span>Expiry date</span><input type="date" name="expiresOn" min={tomorrow} required /></label>
              </div>
              <label className="field"><span>Directions for patient</span><textarea name="privateDirections" rows={4} maxLength={220} placeholder="Take one tablet each morning" required /><small>Encrypted directly to patient. Not stored on Midnight.</small></label>
              {wallet.error && <div className="error-banner" role="alert">{wallet.error}</div>}
              {!wallet.connected && <button type="button" className="button secondary connect-inline" onClick={wallet.connectWallet} disabled={wallet.operation !== "idle"}>{wallet.operation === "connecting" ? "Connecting…" : "Connect hospital 1AM wallet"}</button>}
              <button className="button primary full-button" disabled={wallet.operation !== "idle" || !wallet.connected}>{wallet.operation === "issuing" ? "Issuing on Midnight…" : "Issue prescription"}</button>
            </form>
          </section>
        )}
      </main>
    </AppShell>
  );
}

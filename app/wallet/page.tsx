"use client";

import { FormEvent, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { useWallet } from "@/hooks/useWallet";

export default function WalletPage() {
  const wallet = useWallet();
  const [patientPackage, setPatientPackage] = useState("");
  const [copied, setCopied] = useState<"request" | "fill" | null>(null);

  async function importPrescription(event: FormEvent) {
    event.preventDefault();
    const result = await wallet.importPrescription(patientPackage);
    if (result) setPatientPackage("");
  }

  async function copy(value: string, kind: "request" | "fill") {
    await navigator.clipboard.writeText(value);
    setCopied(kind);
  }

  return (
    <AppShell>
      <main className="clinical-page">
        <header className="page-intro">
          <div><span className="role-tag">Patient</span><h1>My prescription</h1></div>
          <p>Your wallet creates one private request. Your name and wallet address are never written into prescription state.</p>
        </header>

        {!wallet.identity ? (
          <section className="task-card single-task">
            <div className="task-number">1</div>
            <div className="task-content">
              <p className="section-label">Start here</p>
              <h2>Create a private request</h2>
              <p>Approve one message in 1AM. No transaction and no fee.</p>
              {wallet.error && <div className="error-banner" role="alert">{wallet.error}</div>}
              <button className="button primary" onClick={wallet.createIdentity} disabled={wallet.operation !== "idle"}>
                {wallet.operation === "connecting" ? "Waiting for 1AM approval…" : "Create request with 1AM"}
              </button>
            </div>
          </section>
        ) : !wallet.prescription ? (
          <div className="two-step-grid">
            <section className="task-card current-task">
              <div className="task-number">1</div>
              <div className="task-content">
                <p className="section-label">Give to prescriber</p>
                <h2>Patient request</h2>
                <p>This code contains an anonymous commitment and an encryption key. It contains no name or medicine.</p>
                <textarea className="code-box" readOnly rows={5} value={wallet.patientRequest ?? ""} aria-label="Patient request code" />
                <button className="button secondary" onClick={() => copy(wallet.patientRequest ?? "", "request")}>
                  {copied === "request" ? "Request copied" : "Copy request"}
                </button>
              </div>
            </section>

            <section className="task-card">
              <div className="task-number">2</div>
              <form className="task-content" onSubmit={importPrescription}>
                <p className="section-label">Receive from prescriber</p>
                <h2>Add issued prescription</h2>
                <label className="field"><span>Encrypted prescription code</span><textarea rows={5} value={patientPackage} onChange={(event) => setPatientPackage(event.target.value)} required /></label>
                {wallet.error && <div className="error-banner" role="alert">{wallet.error}</div>}
                <button className="button primary" disabled={wallet.operation !== "idle"}>
                  {wallet.operation === "importing" ? "Checking prescription…" : "Add prescription"}
                </button>
              </form>
            </section>
          </div>
        ) : (
          <section className="prescription-sheet">
            <div className="sheet-header">
              <div><p className="section-label">Private prescription</p><h2>{wallet.prescription.medicine}</h2></div>
              <span className={wallet.prescription.fillsRemaining ? "status active" : "status used"}>{wallet.prescription.fillsRemaining ? "Ready to fill" : "Filled"}</span>
            </div>
            <div className="sheet-grid">
              <dl className="clinical-facts">
                <div><dt>Expires</dt><dd>{new Date(`${wallet.prescription.expiresOn}T00:00:00`).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}</dd></div>
                <div><dt>Fills</dt><dd>{wallet.prescription.fillsRemaining} remaining</dd></div>
                <div><dt>Prescription ID</dt><dd className="mono-value">{wallet.prescription.id}</dd></div>
              </dl>
              <div className="directions-panel"><span>Directions</span><p>{wallet.prescription.privateDirections}</p><small>Visible only in this patient session</small></div>
            </div>
            {wallet.error && <div className="error-banner" role="alert">{wallet.error}</div>}
            {wallet.fill ? (
              <div className="fill-receipt">
                <div className="receipt-check">✓</div>
                <div><p className="section-label">Recorded on Midnight</p><h3>Show this transaction to pharmacist</h3><code>{wallet.fill.code}</code></div>
                <button className="button secondary" onClick={() => copy(wallet.fill?.code ?? "", "fill")}>{copied === "fill" ? "Copied" : "Copy transaction"}</button>
              </div>
            ) : (
              <div className="primary-action">
                <div><p className="section-label">At pharmacy counter</p><h3>Authorize this fill</h3><p>One wallet transaction proves validity and permanently marks prescription filled.</p></div>
                <button className="button primary" onClick={wallet.fillPrescription} disabled={wallet.operation !== "idle"}>
                  {wallet.operation === "filling" ? "Proving and recording fill…" : "Fill prescription"}
                </button>
              </div>
            )}
          </section>
        )}
      </main>
    </AppShell>
  );
}

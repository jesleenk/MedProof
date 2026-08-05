"use client";

import { AppShell } from "@/components/AppShell";
import { useWallet } from "@/hooks/useWallet";

export default function WalletPage() {
  const wallet = useWallet();

  return (
    <AppShell>
      <main className="product-page wallet-layout">
        <aside className="context-panel">
          <p className="eyebrow">Patient wallet</p>
          <h1>My prescription</h1>
          <p>Medical details stay here. Generate proof only when pharmacist asks.</p>
          <div className="wallet-security"><span className="lock-shape" />Device-protected credential</div>
        </aside>

        <section className="work-card">
          {!wallet.hydrated ? <div className="loading-line" /> : !wallet.identity ? (
            <div className="empty-view"><span>Rx</span><h2>Create patient identity</h2><p>Generate private wallet secret and public commitment on this device.</p><button className="button primary" onClick={wallet.createIdentity}>Create wallet commitment</button></div>
          ) : !wallet.prescription ? (
            <div className="empty-view"><span>Rx</span><h2>Wallet ready</h2><p>Give this commitment to prescriber. Secret stays on device.</p><code className="commitment-code">{wallet.identity.commitment}</code><button className="button secondary" onClick={() => navigator.clipboard.writeText(wallet.identity!.commitment)}>Copy commitment</button></div>
          ) : (
            <>
              <div className="form-heading"><div><p className="eyebrow">Active credential</p><h2>{wallet.prescription.medicine}</h2></div><span className={wallet.prescription.refillsRemaining ? "status active" : "status used"}>{wallet.prescription.refillsRemaining ? "Available" : "Filled"}</span></div>
              <div className="patient-card">
                <div className="rx-letter">Rx</div>
                <div className="patient-data"><small>Prescription ID</small><strong>{wallet.prescription.id}</strong><div><span>Valid until</span><b>{new Date(wallet.prescription.validUntil).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}</b></div><div><span>Refills remaining</span><b>{wallet.prescription.refillsRemaining}</b></div></div>
                <div className="secret-zone"><small>Private medical details</small><i /><i /><i /><p>Visible only in patient wallet</p></div>
              </div>
              {wallet.error && <div className="error-banner" role="alert">{wallet.error}</div>}
              {wallet.proof ? (
                <div className="proof-ticket">
                  <div className="qr-pattern" aria-hidden="true" />
                  <div><p className="eyebrow">Proof finalized on preprod</p><h3>Present transaction ID</h3><code>{wallet.proof.code}</code><small>Pharmacy validates successful Midnight proof transaction.</small></div>
                </div>
              ) : wallet.prescription.refillsRemaining > 0 ? (
                <div className="action-block"><div><h3>Ready to fill prescription?</h3><p>Wallet generates ZK proof, signs, submits, then waits for preprod finalization.</p></div><button className="button primary" onClick={wallet.generateProof} disabled={wallet.operation !== "idle" || !wallet.connected}>{wallet.operation === "proving" ? "Proving and submitting…" : wallet.connected ? "Generate on-chain proof" : "Connect 1AM first"}</button></div>
              ) : (
                <div className="used-notice"><span>✓</span><div><strong>Prescription filled</strong><p>On-chain refill count is now zero. Same credential cannot be used again.</p></div></div>
              )}
            </>
          )}
        </section>
      </main>
    </AppShell>
  );
}

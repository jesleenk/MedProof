import Link from "next/link";
import { Brand } from "@/components/Brand";
import { MEDPROOF_DEPLOYMENT, shortContractAddress } from "@/lib/deployment";

const portals = [
  { href: "/doctor/issue", number: "01", role: "Prescriber", title: "Issue prescription", copy: "Create one encrypted controlled-medicine credential for a patient wallet." },
  { href: "/wallet", number: "02", role: "Patient", title: "Open private wallet", copy: "Hold prescription details and generate a minimal proof when medicine is needed." },
  { href: "/pharmacy", number: "03", role: "Pharmacist", title: "Verify and dispense", copy: "Check validity, medicine, and refill availability without opening a medical record." },
];

const flow = [
  { number: "01", actor: "Prescriber", title: "Issue", copy: "Doctor enters patient wallet commitment, validity window, and private directions. MedProof creates an encrypted credential and records its commitment." },
  { number: "02", actor: "Patient", title: "Hold", copy: "Credential arrives in patient wallet. Full prescription stays patient-controlled and is never opened for pharmacy staff." },
  { number: "03", actor: "Patient + pharmacy", title: "Prove", copy: "Patient generates a one-time proof for requested medicine. Pharmacist verifies validity and refill availability on the spot." },
  { number: "04", actor: "Patient + pharmacy", title: "Dispense", copy: "Patient authorizes dispense from credential wallet. Pharmacist releases medicine after on-chain nullifier blocks replay and double filling." },
];

const features = [
  { tag: "Selective disclosure", title: "Only necessary facts", copy: "Proof returns medicine, current validity, and refill availability. Everything else remains sealed." },
  { tag: "Patient custody", title: "Credential stays in wallet", copy: "Patient chooses when to generate and present proof. No reusable prescription document changes hands." },
  { tag: "Fraud prevention", title: "One fill means one fill", copy: "Dispense writes a patient-derived nullifier. Reusing same prescription fails across verification attempts." },
  { tag: "Minimal tracking", title: "No pharmacy visit trail", copy: "Doctor, sponsor, and insurer receive no pharmacy visit details unless patient explicitly shares them." },
  { tag: "Time-bound", title: "Validity checked in proof", copy: "Contract checks prescription validity window during proving and again before dispensing." },
  { tag: "Contract aligned", title: "Same checks at every step", copy: "Issuance, proof generation, and dispense screens map directly to MedProof contract circuits." },
];

export default function Home() {
  return (
    <main className="access-page">
      <header className="public-header">
        <Brand />
        <nav className="public-nav" aria-label="Landing page navigation">
          <a href="#how-it-works">How it works</a>
          <a href="#features">Features</a>
          <a href="#privacy">Privacy</a>
        </nav>
        <Link className="network" href="/deploy" title={MEDPROOF_DEPLOYMENT.contractAddress}>
          <i /> Preprod · {shortContractAddress()}
        </Link>
      </header>

      <section className="access-hero">
        <div>
          <p className="eyebrow">Private by default</p>
          <h1>Verify care.<br /><em>Not identity.</em></h1>
        </div>
        <div className="hero-side">
          <p className="hero-copy">MedProof separates medical truth from medical history. Pharmacy receives one answer: whether this prescription can be filled now.</p>
          <div className="hero-actions">
            <Link className="button primary" href="/doctor/issue">Issue prescription</Link>
            <a className="text-link" href="#how-it-works">See complete flow ↓</a>
          </div>
        </div>
      </section>

      <section className="aperture" aria-label="Privacy disclosure comparison">
        <div className="hidden-record">
          <span>Private patient record</span>
          <i className="redact r1" /><i className="redact r2" /><i className="redact r3" /><i className="redact r4" />
        </div>
        <div className="visible-proof">
          <span className="proof-check">✓</span>
          <div><small>Pharmacist sees</small><strong>Valid prescription</strong><p>Methylphenidate 10 mg · 1 refill</p></div>
        </div>
      </section>

      <section className="landing-section flow-section" id="how-it-works">
        <div className="section-intro">
          <p className="eyebrow">How MedProof works</p>
          <h2>One prescription.<br />Four controlled steps.</h2>
          <p>Each participant gets a separate workspace and only permissions needed for their action.</p>
        </div>
        <ol className="flow-list">
          {flow.map((step) => (
            <li key={step.number}>
              <div className="flow-meta"><span>{step.number}</span><small>{step.actor}</small></div>
              <h3>{step.title}</h3>
              <p>{step.copy}</p>
              <i aria-hidden="true" />
            </li>
          ))}
        </ol>
      </section>

      <section className="landing-section workspace-section">
        <div className="section-heading-row">
          <div><p className="eyebrow">Use MedProof</p><h2>Choose your workspace</h2></div>
          <p>Start where your responsibility begins. Workspaces stay separate through entire prescription lifecycle.</p>
        </div>
        <div className="portal-grid" aria-label="Choose access portal">
          {portals.map((portal) => (
            <Link href={portal.href} className="portal-card" key={portal.href}>
              <div><span>{portal.number}</span><small>{portal.role}</small></div>
              <h3>{portal.title}</h3>
              <p>{portal.copy}</p>
              <b>Open portal <span>→</span></b>
            </Link>
          ))}
        </div>
      </section>

      <section className="landing-section features-section" id="features">
        <div className="section-intro compact">
          <p className="eyebrow">Built for least disclosure</p>
          <h2>Useful proof.<br />Minimal exposure.</h2>
        </div>
        <div className="feature-grid">
          {features.map((feature) => (
            <article className="feature-item" key={feature.title}>
              <span>{feature.tag}</span>
              <h3>{feature.title}</h3>
              <p>{feature.copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="landing-section privacy-section" id="privacy">
        <div className="privacy-heading">
          <p className="eyebrow">Disclosure boundary</p>
          <h2>Proof answers eligibility.<br />It does not reveal a chart.</h2>
        </div>
        <div className="disclosure-board">
          <div className="disclosure-column protected">
            <span>Remains private</span>
            <ul><li>Patient identity</li><li>Doctor identity</li><li>Diagnosis</li><li>Other medication</li><li>Dosage history</li><li>Private directions</li></ul>
          </div>
          <div className="disclosure-column verified-column">
            <span>Pharmacist verifies</span>
            <ul><li>Requested medicine matches</li><li>Prescription is valid now</li><li>Refill remains available</li><li>Credential was issued</li><li>Prescription was not filled</li></ul>
          </div>
        </div>
      </section>

      <section className="landing-cta">
        <div><p className="eyebrow">Start a prescription</p><h2>Medical privacy should survive the pharmacy counter.</h2></div>
        <div><Link className="button cta-button" href="/doctor/issue">Open prescriber portal →</Link><p>One controlled medicine · one authorized fill</p></div>
      </section>

      <footer className="public-footer"><span>Powered by Midnight</span><span>No diagnosis. No doctor identity. No visit tracking.</span></footer>
    </main>
  );
}

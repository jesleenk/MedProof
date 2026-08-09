import Link from "next/link";
import { Brand } from "@/components/Brand";
import { shortContractAddress } from "@/lib/deployment";

const pathway = [
  { role: "Patient", title: "Create request", copy: "One wallet signature creates anonymous patient access.", href: "/wallet" },
  { role: "Hospital", title: "Issue order", copy: "Prescriber confirms medicine, expiry, and private directions.", href: "/doctor/issue" },
  { role: "Patient", title: "Fill once", copy: "One transaction proves validity and consumes the prescription.", href: "/wallet" },
  { role: "Pharmacy", title: "Verify release", copy: "Transaction finality confirms medicine release without patient data.", href: "/pharmacy" },
];

export default function Home() {
  return (
    <main className="landing">
      <header className="landing-header"><Brand /><nav><Link href="/wallet">Patient</Link><Link href="/doctor/issue">Hospital</Link><Link href="/pharmacy">Pharmacy</Link></nav><Link className="network" href="/deploy"><i /> Preprod · {shortContractAddress()}</Link></header>

      <section className="landing-hero">
        <div className="hero-copy-block">
          <span className="role-tag">Private prescribing on Midnight</span>
          <h1>A prescription that reveals only permission to dispense.</h1>
          <p>One hospital issue. One patient fill. One pharmacy check. Identity, directions, and medical history stay outside public state.</p>
          <div className="button-row"><Link className="button primary" href="/wallet">Start patient request</Link><Link className="button secondary" href="/doctor/issue">Open hospital desk</Link></div>
        </div>
        <aside className="release-preview">
          <div className="preview-band"><span>Counter result</span><b>Finalized</b></div>
          <div className="preview-body"><span className="preview-check">✓</span><p className="section-label">Medicine release</p><h2>Authorized</h2><strong>Methylphenidate 10 mg</strong></div>
          <dl><div><dt>Fill</dt><dd>Consumed</dd></div><div><dt>Replay</dt><dd>Blocked</dd></div><div><dt>Patient identity</dt><dd>Hidden</dd></div></dl>
        </aside>
      </section>

      <section className="pathway-section">
        <header><p className="section-label">Complete workflow</p><h2>Four actions. Three people. No duplicate proof step.</h2></header>
        <ol>{pathway.map((item, index) => <li key={`${item.role}-${item.title}`}><Link href={item.href}><span>{String(index + 1).padStart(2, "0")}</span><small>{item.role}</small><h3>{item.title}</h3><p>{item.copy}</p></Link></li>)}</ol>
      </section>

      <section className="privacy-strip"><div><span>On Midnight</span><strong>Anonymous commitments · spent nullifiers</strong></div><div><span>Patient only</span><strong>Identity secret · directions · credential</strong></div><div><span>Pharmacy sees</span><strong>Medicine · finalized one-time fill</strong></div></section>
      <footer className="landing-footer"><Brand /><p>MedProof v2 · real Midnight preprod transactions</p><Link href="/deploy">Contract setup</Link></footer>
    </main>
  );
}

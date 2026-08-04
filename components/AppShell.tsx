"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Brand } from "@/components/Brand";
import { MEDPROOF_DEPLOYMENT, shortContractAddress } from "@/lib/deployment";
import { useWallet } from "@/hooks/useWallet";

const items = [
  { href: "/doctor/issue", label: "Issue", scope: "Doctor" },
  { href: "/wallet", label: "Wallet", scope: "Patient" },
  { href: "/pharmacy", label: "Verify", scope: "Pharmacy" },
  { href: "/deploy", label: "Deploy", scope: "Preprod" },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const wallet = useWallet();

  return (
    <div className="app-frame">
      <header className="app-header">
        <Brand />
        <nav aria-label="Main navigation">
          {items.map((item) => (
            <Link className={pathname === item.href ? "active" : ""} href={item.href} key={item.href}>
              <small>{item.scope}</small>{item.label}
            </Link>
          ))}
        </nav>
        <div className="header-actions">
          <Link className="network" href="/deploy" title={`Contract ${MEDPROOF_DEPLOYMENT.contractAddress}`}>
            <i /> Preprod · {shortContractAddress()}
          </Link>
          <button className={`wallet-connect ${wallet.connected ? "connected" : ""}`} onClick={wallet.connectWallet} disabled={wallet.operation !== "idle"}>
            {wallet.connected ? `${wallet.walletAddress?.slice(0, 7)}…${wallet.walletAddress?.slice(-5)}` : wallet.operation === "connecting" ? "Connecting…" : "Connect 1AM"}
          </button>
        </div>
      </header>
      {children}
    </div>
  );
}

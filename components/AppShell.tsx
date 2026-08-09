"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Brand } from "@/components/Brand";
import { configuredContractAddress, MEDPROOF_DEPLOYMENT, shortContractAddress } from "@/lib/deployment";
import { useWallet } from "@/hooks/useWallet";

const items = [
  { href: "/doctor/issue", label: "Prescriber", scope: "Hospital" },
  { href: "/wallet", label: "Patient", scope: "Private" },
  { href: "/pharmacy", label: "Pharmacy", scope: "Counter" },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const wallet = useWallet();
  const [contractAddress, setContractAddress] = useState(MEDPROOF_DEPLOYMENT.contractAddress);
  useEffect(() => {
    const frame = window.requestAnimationFrame(() => setContractAddress(configuredContractAddress()));
    return () => window.cancelAnimationFrame(frame);
  }, [pathname]);

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
          <Link className="network" href="/deploy" title={contractAddress ? `Contract ${contractAddress}` : "Deploy MedProof v2"}>
            <i /> Preprod · {shortContractAddress(contractAddress)}
          </Link>
          {pathname !== "/pharmacy" && <button className={`wallet-connect ${wallet.connected ? "connected" : ""}`} onClick={wallet.connectWallet} disabled={wallet.operation !== "idle"}>
            {wallet.connected ? `1AM · ${wallet.walletAddress?.slice(-6)}` : wallet.operation === "connecting" ? "Connecting…" : "Connect 1AM"}
          </button>}
        </div>
      </header>
      {children}
    </div>
  );
}

"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { deployMedProof } from "@/lib/deploy-medproof";
import { MEDPROOF_DEPLOYMENT } from "@/lib/deployment";
import {
  connectOneAmPreprod,
  detectOneAmWallet,
  MIDNIGHT_NETWORK_ID,
  pollForContractState,
  type ConnectedSession,
} from "@/lib/midnight";

const DEPLOYED_ADDRESS_KEY = "medproof:preprod:contract-address";
const DEPLOY_CONFIRMED_KEY = "medproof:preprod:deployment-confirmed";

export default function DeployPage() {
  const [walletInstalled, setWalletInstalled] = useState<boolean | null>(null);
  const [session, setSession] = useState<ConnectedSession | null>(null);
  const [contractAddress, setContractAddress] = useState<string>(MEDPROOF_DEPLOYMENT.contractAddress);
  const [status, setStatus] = useState("Configured deployment confirmed on preprod");
  const [error, setError] = useState("");
  const [connecting, setConnecting] = useState(false);
  const [deploying, setDeploying] = useState(false);
  const [confirmed, setConfirmed] = useState(true);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    const frame = window.requestAnimationFrame(() => {
      window.localStorage.setItem(DEPLOYED_ADDRESS_KEY, MEDPROOF_DEPLOYMENT.contractAddress);
      window.localStorage.setItem(DEPLOY_CONFIRMED_KEY, "true");
      detectOneAmWallet().then((wallet) => {
        if (mounted.current) setWalletInstalled(wallet !== null);
      });
    });
    return () => {
      mounted.current = false;
      window.cancelAnimationFrame(frame);
    };
  }, []);

  const connect = useCallback(async () => {
    setConnecting(true);
    setError("");
    setStatus("Requesting 1AM connection…");
    try {
      const connected = await connectOneAmPreprod();
      if (!mounted.current) return;
      setSession(connected);
      setStatus("Wallet connected to preprod");
    } catch (caught) {
      if (mounted.current) {
        setError(caught instanceof Error ? caught.message : "Wallet connection failed.");
        setStatus("Connection required");
      }
    } finally {
      if (mounted.current) setConnecting(false);
    }
  }, []);

  const deploy = useCallback(async () => {
    if (!session) return;
    setDeploying(true);
    setConfirmed(false);
    window.localStorage.removeItem(DEPLOY_CONFIRMED_KEY);
    setError("");
    setStatus("Creating deployment transaction…");
    try {
      const address = await deployMedProof(session);
      if (!mounted.current) return;
      setContractAddress(address);
      window.localStorage.setItem(DEPLOYED_ADDRESS_KEY, address);
      setStatus("Submitted. Waiting for preprod indexer…");
      await pollForContractState(session.config.indexerUri, address, (attempt) => {
        if (mounted.current) setStatus(`Waiting for preprod indexer · attempt ${attempt}`);
      });
      if (!mounted.current) return;
      setConfirmed(true);
      window.localStorage.setItem(DEPLOY_CONFIRMED_KEY, "true");
      setStatus("Deployment confirmed on preprod");
    } catch (caught) {
      if (mounted.current) {
        setError(caught instanceof Error ? caught.message : "Contract deployment failed.");
        setStatus("Deployment stopped");
      }
    } finally {
      if (mounted.current) setDeploying(false);
    }
  }, [session]);

  async function copyAddress() {
    await navigator.clipboard.writeText(contractAddress);
    setStatus("Contract address copied");
  }

  return (
    <AppShell>
      <main className="deploy-page">
        <section className="deploy-intro">
          <p className="eyebrow">Contract deployment</p>
          <h1>Deploy MedProof<br />through 1AM.</h1>
          <p>Browser extension creates proof, balances transaction through ProofStation, and submits directly to Midnight preprod.</p>
          <div className="deploy-guardrails">
            <span>Network</span><strong>Midnight preprod</strong>
            <span>Signer</span><strong>Connected 1AM wallet</strong>
            <span>Proving</span><strong>1AM provider</strong>
            <span>Server deployer</span><strong>None</strong>
          </div>
        </section>

        <section className="deploy-console">
          <div className="console-header">
            <div><p className="eyebrow">Deployment console</p><h2>MedProof.compact</h2></div>
            <span className="preprod-chip"><i /> {MIDNIGHT_NETWORK_ID}</span>
          </div>

          <ol className="deploy-steps">
            <li className={session || confirmed ? "complete" : "current"}><span>1</span><div><strong>Connect wallet</strong><p>Authorize 1AM browser extension on preprod.</p></div></li>
            <li className={deploying ? "current" : confirmed ? "complete" : ""}><span>2</span><div><strong>Prove and submit</strong><p>Wallet provider proves, balances, and submits deployment.</p></div></li>
            <li className={confirmed ? "complete" : ""}><span>3</span><div><strong>Confirm address</strong><p>Indexer confirms contract state and address stays visible.</p></div></li>
          </ol>

          {walletInstalled === false && !confirmed && (
            <div className="wallet-missing">
              <strong>1AM extension required</strong>
              <p>Install extension, select preprod, then reload this page.</p>
              <a className="button primary" href="https://1am.xyz" target="_blank" rel="noreferrer">Install 1AM</a>
            </div>
          )}

          {walletInstalled !== false && !session && !confirmed && (
            <button className="button primary deploy-action" onClick={connect} disabled={connecting || walletInstalled === null}>
              {connecting ? "Connecting…" : walletInstalled === null ? "Detecting 1AM…" : "Connect 1AM on preprod"}
            </button>
          )}

          {session && !confirmed && (
            <div className="connected-wallet">
              <small>Connected wallet</small>
              <code>{session.unshieldedAddress}</code>
              <button className="button primary deploy-action" onClick={deploy} disabled={deploying}>
                {deploying ? status : "Deploy MedProof contract"}
              </button>
            </div>
          )}

          {contractAddress && (
            <div className={`address-result ${confirmed ? "confirmed" : ""}`}>
              <div><span>{confirmed ? "Official preprod contract" : "Submitted contract address"}</span><strong>{confirmed ? "Deployment live" : "Awaiting indexer confirmation"}</strong></div>
              <code>{contractAddress}</code>
              <button onClick={copyAddress}>Copy address</button>
            </div>
          )}

          <div className="deploy-status" aria-live="polite"><i className={deploying ? "pulse" : ""} /><span>{status}</span></div>
          {error && <div className="error-banner deploy-error" role="alert">{error}</div>}
          <p className="proofstation-note">No local proof server. No seed phrase. No funded server wallet. 1AM ProofStation handles proving and fee sponsorship.</p>
        </section>
      </main>
    </AppShell>
  );
}

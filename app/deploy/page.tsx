"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { deployMedProof } from "@/lib/deploy-medproof";
import { configuredContractAddress, MEDPROOF_DEPLOYMENT, saveLocalContractAddress } from "@/lib/deployment";
import {
  connectOneAmPreprod,
  detectOneAmWallet,
  MIDNIGHT_NETWORK_ID,
  pollForContractState,
  type ConnectedSession,
} from "@/lib/midnight";

export default function DeployPage() {
  const [walletInstalled, setWalletInstalled] = useState<boolean | null>(null);
  const [session, setSession] = useState<ConnectedSession | null>(null);
  const [contractAddress, setContractAddress] = useState<string>(MEDPROOF_DEPLOYMENT.contractAddress);
  const [status, setStatus] = useState(MEDPROOF_DEPLOYMENT.contractAddress ? "Configured contract address loaded" : "Deployment required for MedProof v2");
  const [error, setError] = useState("");
  const [connecting, setConnecting] = useState(false);
  const [deploying, setDeploying] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    const frame = window.requestAnimationFrame(() => {
      const configuredAddress = configuredContractAddress();
      if (configuredAddress) {
        setContractAddress(configuredAddress);
        setStatus("Configured contract address loaded");
      }
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
      const configuredAddress = configuredContractAddress();
      if (configuredAddress) {
        const state = await connected.providers.publicDataProvider.queryContractState(configuredAddress);
        if (!mounted.current) return;
        setConfirmed(Boolean(state));
        setStatus(state ? "Configured deployment confirmed on preprod" : "Configured address not found on preprod");
      } else {
        setStatus("Wallet connected. Ready to deploy current contract.");
      }
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
    setError("");
    setStatus("Creating deployment transaction…");
    try {
      const address = await deployMedProof(session);
      if (!mounted.current) return;
      setContractAddress(address);
      setStatus("Submitted. Waiting for preprod indexer…");
      await pollForContractState(session.config.indexerUri, address, (attempt) => {
        if (mounted.current) setStatus(`Waiting for preprod indexer · attempt ${attempt}`);
      });
      if (!mounted.current) return;
      setConfirmed(true);
      saveLocalContractAddress(address);
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
          <h1>Deploy MedProof v2.</h1>
          <p>Current ProofStation generates proof. 1AM approves, sponsors, balances, and submits to Midnight preprod.</p>
          <div className="deploy-guardrails">
            <span>Network</span><strong>Midnight preprod</strong>
            <span>Signer</span><strong>Connected 1AM wallet</strong>
            <span>Proving</span><strong>ProofStation HTTP</strong>
            <span>Server deployer</span><strong>None</strong>
          </div>
        </section>

        <section className="deploy-console">
          <div className="console-header">
            <div><p className="eyebrow">Fresh deployment</p><h2>MedProof v2 · two circuits</h2></div>
            <span className="preprod-chip"><i /> {MIDNIGHT_NETWORK_ID}</span>
          </div>

          <ol className="deploy-steps">
            <li className={session || confirmed ? "complete" : "current"}><span>1</span><div><strong>Connect wallet</strong><p>Authorize 1AM browser extension on preprod.</p></div></li>
            <li className={deploying ? "current" : confirmed ? "complete" : ""}><span>2</span><div><strong>Prove and submit</strong><p>ProofStation proves. 1AM balances and submits deployment.</p></div></li>
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
                {deploying ? status : "Deploy MedProof v2"}
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

          {confirmed && (
            <div className="config-instruction">
              <strong>Activate this deployment</strong>
              <p>Activated in this browser. Production deployment should pin same address with environment variable.</p>
              <code>NEXT_PUBLIC_MEDPROOF_CONTRACT_ADDRESS={contractAddress}</code>
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

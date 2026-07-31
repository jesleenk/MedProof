"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  createPatientIdentity,
  dispenseOnChain,
  issueOnChain,
  proveOnChain,
  STORAGE_KEY,
  verifyOnChain,
  type IssueInput,
  type PatientIdentity,
  type PrescriptionRecord,
  type ProofRecord,
  type WorkspaceState,
} from "@/lib/medproof";
import { connectOneAmPreprod, type ConnectedSession } from "@/lib/midnight";

type Operation = "idle" | "connecting" | "issuing" | "proving" | "verifying" | "dispensing";

type WalletContextValue = WorkspaceState & {
  hydrated: boolean;
  operation: Operation;
  error: string | null;
  connected: boolean;
  walletAddress: string | null;
  connectWallet(): Promise<boolean>;
  createIdentity(): PatientIdentity;
  issuePrescription(input: IssueInput): Promise<PrescriptionRecord | null>;
  generateProof(): Promise<ProofRecord | null>;
  verifyProof(code: string): Promise<ProofRecord | null>;
  dispense(): Promise<PrescriptionRecord | null>;
  clearError(): void;
};

const WalletContext = createContext<WalletContextValue | null>(null);
const emptyState: WorkspaceState = { identity: null, prescription: null, proof: null };

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<WorkspaceState>(emptyState);
  const [session, setSession] = useState<ConnectedSession | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [operation, setOperation] = useState<Operation>("idle");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      try {
        const stored = window.localStorage.getItem(STORAGE_KEY);
        if (stored) setState(JSON.parse(stored) as WorkspaceState);
      } catch {
        setState(emptyState);
      } finally {
        setHydrated(true);
      }
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (hydrated) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [hydrated, state]);

  async function run<T>(name: Operation, task: () => Promise<T>): Promise<T | null> {
    setOperation(name);
    setError(null);
    try {
      return await task();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Operation failed.");
      return null;
    } finally {
      setOperation("idle");
    }
  }

  async function connectWallet() {
    if (session) return true;
    const connectedSession = await run("connecting", connectOneAmPreprod);
    if (!connectedSession) return false;
    setSession(connectedSession);
    return true;
  }

  function requireSession() {
    if (!session) throw new Error("Connect 1AM wallet to preprod before submitting transaction.");
    return session;
  }

  function createIdentity() {
    const identity = createPatientIdentity();
    setState({ identity, prescription: null, proof: null });
    setError(null);
    return identity;
  }

  async function issuePrescription(input: IssueInput) {
    return run("issuing", async () => {
      if (!state.identity) throw new Error("Create patient wallet commitment first.");
      const prescription = await issueOnChain(requireSession(), state.identity, input);
      setState((current) => ({ ...current, prescription, proof: null }));
      return prescription;
    });
  }

  async function generateProof() {
    return run("proving", async () => {
      if (!state.prescription || !state.identity) throw new Error("Patient credential is missing from this device.");
      const proof = await proveOnChain(requireSession(), state.prescription, state.identity);
      setState((current) => ({ ...current, proof }));
      return proof;
    });
  }

  async function verifyProof(code: string) {
    return run("verifying", () => verifyOnChain(requireSession(), code, state.proof));
  }

  async function dispense() {
    return run("dispensing", async () => {
      if (!state.prescription || !state.identity) throw new Error("Patient credential is missing from this device.");
      const prescription = await dispenseOnChain(requireSession(), state.prescription, state.identity);
      setState((current) => ({ ...current, prescription, proof: null }));
      return prescription;
    });
  }

  const value = useMemo<WalletContextValue>(
    () => ({
      ...state,
      hydrated,
      operation,
      error,
      connected: Boolean(session),
      walletAddress: session?.unshieldedAddress ?? null,
      connectWallet,
      createIdentity,
      issuePrescription,
      generateProof,
      verifyProof,
      dispense,
      clearError: () => setError(null),
    }),
    // Functions intentionally refresh with current session and private credential.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [state, session, hydrated, operation, error],
  );

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>;
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (!context) throw new Error("useWallet must be used inside WalletProvider.");
  return context;
}

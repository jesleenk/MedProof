"use client";

import { createContext, useContext, useMemo, useState } from "react";
import {
  createPatientIdentity,
  fillOnChain,
  importPrescriptionPackage,
  issueOnChain,
  patientRequestFor,
  verifyFillOnChain,
  type FillRecord,
  type IssueInput,
  type IssuedPrescription,
  type PatientIdentity,
  type PrescriptionRecord,
  type WorkspaceState,
} from "@/lib/medproof";
import { connectOneAmPreprod, type ConnectedSession } from "@/lib/midnight";

type Operation = "idle" | "connecting" | "issuing" | "importing" | "filling" | "verifying";

type WalletContextValue = WorkspaceState & {
  operation: Operation;
  error: string | null;
  connected: boolean;
  walletAddress: string | null;
  patientRequest: string | null;
  connectWallet(): Promise<boolean>;
  createIdentity(): Promise<PatientIdentity | null>;
  issuePrescription(input: IssueInput): Promise<IssuedPrescription | null>;
  importPrescription(value: string): Promise<PrescriptionRecord | null>;
  fillPrescription(): Promise<FillRecord | null>;
  verifyFill(code: string): Promise<FillRecord | null>;
  clearError(): void;
};

const WalletContext = createContext<WalletContextValue | null>(null);
const emptyState: WorkspaceState = { identity: null, prescription: null, fill: null };

function operationMessage(caught: unknown) {
  const message = caught instanceof Error ? caught.message : "Operation failed.";
  if (/Custom error: 170/i.test(message)) return "Old contract detected. Deploy MedProof v2 and create a new patient request.";
  if (/temporarily banned/i.test(message)) return "ProofStation blocked a repeated failed transaction. Wait five minutes, then use a new patient request.";
  if (/expected header tag/i.test(message)) return "Wallet proof components are out of date. Update 1AM, restart this app, then create a new request.";
  return message;
}

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<WorkspaceState>(emptyState);
  const [session, setSession] = useState<ConnectedSession | null>(null);
  const [operation, setOperation] = useState<Operation>("idle");
  const [error, setError] = useState<string | null>(null);

  async function run<T>(name: Operation, task: () => Promise<T>): Promise<T | null> {
    if (operation !== "idle") return null;
    setOperation(name);
    setError(null);
    try { return await task(); }
    catch (caught) { setError(operationMessage(caught)); return null; }
    finally { setOperation("idle"); }
  }

  async function activeSession() {
    if (session) return session;
    const connected = await connectOneAmPreprod();
    setSession(connected);
    return connected;
  }

  async function connectWallet() {
    if (session) return true;
    return Boolean(await run("connecting", activeSession));
  }

  function connectedSession() {
    if (!session) throw new Error("Connect hospital 1AM wallet before issuing.");
    return session;
  }

  async function createIdentity() {
    return run("connecting", async () => {
      const identity = await createPatientIdentity(await activeSession());
      setState({ identity, prescription: null, fill: null });
      return identity;
    });
  }

  async function issuePrescription(input: IssueInput) {
    return run("issuing", () => issueOnChain(connectedSession(), input));
  }

  async function importPrescription(value: string) {
    return run("importing", async () => {
      if (!state.identity) throw new Error("Create patient request first.");
      const prescription = await importPrescriptionPackage(state.identity, value);
      setState((current) => ({ ...current, prescription, fill: null }));
      return prescription;
    });
  }

  async function fillPrescription() {
    return run("filling", async () => {
      if (!state.prescription || !state.identity) throw new Error("Patient prescription is missing from this session.");
      const result = await fillOnChain(await activeSession(), state.prescription, state.identity);
      setState((current) => ({ ...current, prescription: result.prescription, fill: result.fill }));
      return result.fill;
    });
  }

  async function verifyFill(code: string) {
    return run("verifying", () => verifyFillOnChain(code));
  }

  const value = useMemo<WalletContextValue>(() => ({
    ...state,
    operation,
    error,
    connected: Boolean(session),
    walletAddress: session?.unshieldedAddress ?? null,
    patientRequest: state.identity ? patientRequestFor(state.identity) : null,
    connectWallet,
    createIdentity,
    issuePrescription,
    importPrescription,
    fillPrescription,
    verifyFill,
    clearError: () => setError(null),
    // Functions intentionally refresh with current wallet and credential state.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }), [state, session, operation, error]);

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>;
}

export function useWallet() {
  const value = useContext(WalletContext);
  if (!value) throw new Error("useWallet must be used inside WalletProvider.");
  return value;
}

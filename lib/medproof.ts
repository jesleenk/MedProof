"use client";

import { SucceedEntirely } from "@midnight-ntwrk/midnight-js-types";
import { submitCallTxAsync } from "@midnight-ntwrk/midnight-js-contracts";
import { MedProof } from "@contract/index";
import {
  compiledMedProof,
  doctorSecret,
  MEDICINE_IDENTIFIER,
  PRIVATE_STATE_ID,
  sha256,
} from "@/lib/deploy-medproof";
import { MEDPROOF_DEPLOYMENT } from "@/lib/deployment";
import { fromHex, toHex, type ConnectedSession } from "@/lib/midnight";

export const SUPPORTED_MEDICINE = "Methylphenidate 10 mg";
export const STORAGE_KEY = "medproof:workspace:v2";
export const MEDPROOF_CONTRACT_ADDRESS = MEDPROOF_DEPLOYMENT.contractAddress;

type Criteria = {
  patientCommit: string;
  drugHash: string;
  validFrom: string;
  validUntil: string;
  refillsTotal: number;
};

export type PatientIdentity = {
  commitment: string;
  secret: string;
  nonce: string;
};

export type PrescriptionRecord = {
  id: string;
  patientCommitment: string;
  medicine: string;
  validFrom: string;
  validUntil: string;
  refillsRemaining: number;
  issuedAt: string;
  transactionHash: string;
  prescriptionNonce: string;
  criteria: Criteria;
};

export type ProofRecord = {
  id: string;
  prescriptionId: string;
  medicine: string;
  refillsRemaining: number;
  createdAt: string;
  code: string;
  transactionHash: string;
};

export type WorkspaceState = {
  identity: PatientIdentity | null;
  prescription: PrescriptionRecord | null;
  proof: ProofRecord | null;
};

export type IssueInput = {
  patientCommitment: string;
  validFrom: string;
  validUntil: string;
  privateDirections: string;
};

type Credential = {
  criteria: {
    patientCommit: Uint8Array;
    drugHash: Uint8Array;
    validFrom: bigint;
    validUntil: bigint;
    refillsTotal: bigint;
  };
  prescriptionNonce: Uint8Array;
  patientSecret: Uint8Array;
  patientNonce: Uint8Array;
  prescriptionPath: ReturnType<ReturnType<typeof MedProof.ledger>["issuedPrescriptions"]["findPathForLeaf"]>;
};

const randomBytes = (size: number) => crypto.getRandomValues(new Uint8Array(size));
const dateSeconds = (date: string, endOfDay = false) => {
  const suffix = endOfDay ? "T23:59:59.000Z" : "T00:00:00.000Z";
  const value = Date.parse(`${date}${suffix}`);
  if (!Number.isFinite(value)) throw new Error("Invalid prescription validity date.");
  return BigInt(Math.floor(value / 1_000));
};

function contractMath() {
  const unavailable = () => { throw new Error("Witness unavailable for local commitment calculation."); };
  return new MedProof.Contract({ doctorSecretKey: unavailable, prescriptionCredential: unavailable }) as unknown as {
    _patientCommitment_0(secret: Uint8Array, nonce: Uint8Array): Uint8Array;
  };
}

export function createPatientIdentity(): PatientIdentity {
  const secret = randomBytes(32);
  const nonce = randomBytes(32);
  return { secret: toHex(secret), nonce: toHex(nonce), commitment: toHex(contractMath()._patientCommitment_0(secret, nonce)) };
}

async function encryptDirections(plaintext: string, identity: PatientIdentity): Promise<Uint8Array> {
  const encoded = new TextEncoder().encode(plaintext.trim());
  if (!encoded.length) throw new Error("Private directions are required.");
  if (encoded.length > 220) throw new Error("Private directions must be 220 bytes or fewer.");
  const secretBytes = fromHex(identity.secret);
  const keyMaterial = await crypto.subtle.digest("SHA-256", secretBytes.buffer as ArrayBuffer);
  const key = await crypto.subtle.importKey("raw", keyMaterial, "AES-GCM", false, ["encrypt"]);
  const iv = randomBytes(12);
  const ciphertext = new Uint8Array(await crypto.subtle.encrypt(
    { name: "AES-GCM", iv: iv.buffer as ArrayBuffer },
    key,
    encoded.buffer as ArrayBuffer,
  ));
  const packed = new Uint8Array(256);
  packed[0] = 1;
  packed[1] = ciphertext.length;
  packed.set(iv, 2);
  packed.set(ciphertext, 14);
  return packed;
}

async function medicineHash() {
  return sha256(MEDICINE_IDENTIFIER);
}

async function waitForFinality(session: ConnectedSession, txId: string) {
  let timeoutId: number | undefined;
  try {
    return await Promise.race([
      session.providers.publicDataProvider.watchForTxData(txId),
      new Promise<never>((_, reject) => {
        timeoutId = window.setTimeout(
          () => reject(new Error("Preprod indexer did not finalize transaction within 3 minutes.")),
          180_000,
        );
      }),
    ]);
  } finally {
    if (timeoutId) window.clearTimeout(timeoutId);
  }
}

async function finalizedCall<T>(
  session: ConnectedSession,
  compiledContract: unknown,
  circuitId: string,
  args: unknown[],
): Promise<{ txId: string; result: T }> {
  session.providers.privateStateProvider.setContractAddress(MEDPROOF_CONTRACT_ADDRESS);
  if (!(await session.providers.privateStateProvider.get(PRIVATE_STATE_ID))) {
    await session.providers.privateStateProvider.set(PRIVATE_STATE_ID, {});
  }
  const submitted = await (submitCallTxAsync as never as (
    providers: unknown,
    options: unknown,
  ) => Promise<{ txId: string; callTxData: { private: { result: T; nextPrivateState: unknown } } }>) (
    session.providers,
    { compiledContract, contractAddress: MEDPROOF_CONTRACT_ADDRESS, circuitId, args, privateStateId: PRIVATE_STATE_ID },
  );
  const finalized = await waitForFinality(session, submitted.txId);
  if (finalized.status !== SucceedEntirely) {
    throw new Error(`${circuitId} transaction failed on Midnight (${finalized.status}).`);
  }
  await session.providers.privateStateProvider.set(PRIVATE_STATE_ID, submitted.callTxData.private.nextPrivateState);
  return { txId: submitted.txId, result: submitted.callTxData.private.result };
}

async function credentialFor(session: ConnectedSession, record: PrescriptionRecord, identity: PatientIdentity): Promise<Credential> {
  if (identity.commitment !== record.patientCommitment) {
    throw new Error("Connected patient identity does not own this prescription.");
  }
  const state = await session.providers.publicDataProvider.queryContractState(MEDPROOF_CONTRACT_ADDRESS);
  if (!state) throw new Error("Deployed contract state not found on preprod indexer.");
  const path = MedProof.ledger(state.data).issuedPrescriptions.findPathForLeaf(fromHex(record.id));
  if (!path) throw new Error("Prescription commitment not found in deployed contract state.");
  return {
    criteria: {
      patientCommit: fromHex(record.criteria.patientCommit),
      drugHash: fromHex(record.criteria.drugHash),
      validFrom: BigInt(record.criteria.validFrom),
      validUntil: BigInt(record.criteria.validUntil),
      refillsTotal: BigInt(record.criteria.refillsTotal),
    },
    prescriptionNonce: fromHex(record.prescriptionNonce),
    patientSecret: fromHex(identity.secret),
    patientNonce: fromHex(identity.nonce),
    prescriptionPath: path,
  };
}

const unavailableCredential = () => { throw new Error("Patient credential unavailable for doctor transaction."); };

export async function issueOnChain(
  session: ConnectedSession,
  identity: PatientIdentity,
  input: IssueInput,
): Promise<PrescriptionRecord> {
  const commitment = input.patientCommitment.trim().toLowerCase().replace(/^0x/, "");
  if (commitment !== identity.commitment) throw new Error("Use patient commitment created in this wallet.");
  if (fromHex(commitment).length !== 32) throw new Error("Patient commitment must be 32-byte hex.");
  const validFrom = dateSeconds(input.validFrom);
  const validUntil = dateSeconds(input.validUntil, true);
  if (validUntil <= validFrom) throw new Error("Expiry must be later than valid-from date.");
  const [secret, drugHash, encryptedDetails] = await Promise.all([
    doctorSecret(session), medicineHash(), encryptDirections(input.privateDirections, identity),
  ]);
  const prescriptionNonce = randomBytes(32);
  const witnesses = {
    doctorSecretKey: <PS>(context: { privateState: PS }): [PS, Uint8Array] => [context.privateState, secret],
    prescriptionCredential: unavailableCredential,
  };
  const { txId, result } = await finalizedCall<Uint8Array>(
    session,
    compiledMedProof(witnesses as never),
    "issuePrescription",
    [fromHex(commitment), validFrom, validUntil, encryptedDetails, prescriptionNonce],
  );
  return {
    id: toHex(result),
    patientCommitment: commitment,
    medicine: SUPPORTED_MEDICINE,
    validFrom: input.validFrom,
    validUntil: input.validUntil,
    refillsRemaining: 1,
    issuedAt: new Date().toISOString(),
    transactionHash: txId,
    prescriptionNonce: toHex(prescriptionNonce),
    criteria: {
      patientCommit: commitment,
      drugHash: toHex(drugHash),
      validFrom: validFrom.toString(),
      validUntil: validUntil.toString(),
      refillsTotal: 1,
    },
  };
}

export async function proveOnChain(session: ConnectedSession, record: PrescriptionRecord, identity: PatientIdentity): Promise<ProofRecord> {
  const credential = await credentialFor(session, record, identity);
  const witnesses = {
    doctorSecretKey: () => { throw new Error("Doctor witness unavailable for patient transaction."); },
    prescriptionCredential: <PS>(context: { privateState: PS }): [PS, Credential] => [context.privateState, credential],
  };
  const { txId, result } = await finalizedCall<{ valid: boolean; drugHash: Uint8Array; refillsRemaining: bigint }>(
    session,
    compiledMedProof(witnesses as never),
    "proveValidPrescription",
    [await medicineHash()],
  );
  if (!result.valid) throw new Error("Contract rejected prescription validity proof.");
  return {
    id: txId,
    prescriptionId: record.id,
    medicine: SUPPORTED_MEDICINE,
    refillsRemaining: Number(result.refillsRemaining),
    createdAt: new Date().toISOString(),
    code: txId.toUpperCase(),
    transactionHash: txId,
  };
}

export async function verifyOnChain(session: ConnectedSession, code: string, proof: ProofRecord | null): Promise<ProofRecord> {
  const txId = code.trim().toLowerCase().replace(/^0x/, "");
  if (!proof || proof.transactionHash.toLowerCase() !== txId) throw new Error("Proof transaction does not match patient proof.");
  const finalized = await waitForFinality(session, txId);
  if (finalized.status !== SucceedEntirely) throw new Error(`Proof transaction failed on Midnight (${finalized.status}).`);
  const isMedProofCall = Array.from(finalized.tx.intents?.values() ?? []).some((intent) =>
    intent.actions.some((action) =>
      "address" in action &&
      "entryPoint" in action &&
      String(action.address) === MEDPROOF_CONTRACT_ADDRESS &&
      action.entryPoint === "proveValidPrescription",
    ),
  );
  if (!isMedProofCall) throw new Error("Transaction is not MedProof proveValidPrescription call.");
  return proof;
}

export async function dispenseOnChain(session: ConnectedSession, record: PrescriptionRecord, identity: PatientIdentity): Promise<PrescriptionRecord> {
  const credential = await credentialFor(session, record, identity);
  const witnesses = {
    doctorSecretKey: () => { throw new Error("Doctor witness unavailable for patient transaction."); },
    prescriptionCredential: <PS>(context: { privateState: PS }): [PS, Credential] => [context.privateState, credential],
  };
  const { txId, result } = await finalizedCall<bigint>(
    session,
    compiledMedProof(witnesses as never),
    "dispense",
    [await medicineHash()],
  );
  return { ...record, refillsRemaining: Number(result), transactionHash: txId };
}

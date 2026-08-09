"use client";

import { SucceedEntirely } from "@midnight-ntwrk/midnight-js-types";
import { submitCallTxAsync } from "@midnight-ntwrk/midnight-js-contracts";
import { MedProof } from "@contract/index";
import { compiledMedProof, doctorSecret, MEDICINE_IDENTIFIER, PRIVATE_STATE_ID, sha256 } from "@/lib/deploy-medproof";
import { configuredContractAddress, MEDPROOF_DEPLOYMENT } from "@/lib/deployment";
import { createPreprodPublicDataProvider, fromHex, toHex, type ConnectedSession } from "@/lib/midnight";

export const SUPPORTED_MEDICINE = "Methylphenidate 10 mg";

type Criteria = {
  patientCommit: string;
  drugHash: string;
  expiresAt: string;
  directionsHash: string;
};

export type PatientIdentity = {
  commitment: string;
  secret: string;
  nonce: string;
  deliveryPrivateKey: JsonWebKey;
  deliveryPublicKey: string;
};

export type PrescriptionRecord = {
  id: string;
  patientCommitment: string;
  medicine: string;
  expiresOn: string;
  fillsRemaining: number;
  issuedAt: string;
  issueTransactionHash: string;
  prescriptionNonce: string;
  encryptedDirections: string;
  privateDirections: string;
  criteria: Criteria;
};

export type IssuedPrescription = {
  id: string;
  medicine: string;
  expiresOn: string;
  transactionHash: string;
  patientPackage: string;
};

export type FillRecord = {
  medicine: string;
  filledAt: string;
  transactionHash: string;
  code: string;
};

export type WorkspaceState = {
  identity: PatientIdentity | null;
  prescription: PrescriptionRecord | null;
  fill: FillRecord | null;
};

export type IssueInput = {
  patientRequest: string;
  expiresOn: string;
  privateDirections: string;
};

type Credential = {
  criteria: {
    patientCommit: Uint8Array;
    drugHash: Uint8Array;
    expiresAt: bigint;
    directionsHash: Uint8Array;
  };
  prescriptionNonce: Uint8Array;
  patientSecret: Uint8Array;
  patientNonce: Uint8Array;
  prescriptionPath: ReturnType<ReturnType<typeof MedProof.ledger>["prescriptions"]["findPathForLeaf"]>;
};

const encoder = new TextEncoder();
const randomBytes = (size: number) => crypto.getRandomValues(new Uint8Array(size));

function requireContractAddress() {
  const contractAddress = configuredContractAddress();
  if (!contractAddress) {
    throw new Error("MedProof v2 is not deployed. Hospital administrator must deploy it first.");
  }
  return contractAddress;
}

function encodeTransfer(value: unknown) {
  let binary = "";
  for (const byte of encoder.encode(JSON.stringify(value))) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function decodeTransfer<T>(value: string): T {
  const normalized = value.trim().replace(/-/g, "+").replace(/_/g, "/");
  const binary = atob(normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "="));
  return JSON.parse(new TextDecoder().decode(Uint8Array.from(binary, (character) => character.charCodeAt(0)))) as T;
}

function expirySeconds(date: string) {
  const value = Date.parse(`${date}T23:59:59.000Z`);
  if (!Number.isFinite(value)) throw new Error("Choose a valid expiry date.");
  if (value <= Date.now()) throw new Error("Expiry date must be in the future.");
  return BigInt(Math.floor(value / 1_000));
}

async function hashBytes(value: Uint8Array) {
  return new Uint8Array(await crypto.subtle.digest("SHA-256", value.buffer as ArrayBuffer));
}

function contractMath() {
  const unavailable = () => { throw new Error("Witness unavailable for local commitment calculation."); };
  return new MedProof.Contract({ doctorSecretKey: unavailable, prescriptionCredential: unavailable }) as unknown as {
    _patientCommitment_0(secret: Uint8Array, nonce: Uint8Array): Uint8Array;
    _doctorKey_0(secret: Uint8Array): Uint8Array;
  };
}

function equalBytes(left: Uint8Array, right: Uint8Array) {
  return left.length === right.length && left.every((byte, index) => byte === right[index]);
}

export async function createPatientIdentity(session: ConnectedSession): Promise<PatientIdentity> {
  const contractAddress = requireContractAddress();
  const signature = await session.api.signData(`medproof:patient:v2|${contractAddress}`, { encoding: "text" });
  const deliveryKeyPair = await crypto.subtle.generateKey({ name: "ECDH", namedCurve: "P-256" }, true, ["deriveKey"]);
  const [secret, nonce, deliveryPrivateKey, deliveryPublicKey] = await Promise.all([
    sha256(`medproof:patient-secret:v2|${signature}`),
    sha256(`medproof:patient-nonce:v2|${signature}`),
    crypto.subtle.exportKey("jwk", deliveryKeyPair.privateKey),
    crypto.subtle.exportKey("raw", deliveryKeyPair.publicKey),
  ]);
  return {
    secret: toHex(secret),
    nonce: toHex(nonce),
    commitment: toHex(contractMath()._patientCommitment_0(secret, nonce)),
    deliveryPrivateKey,
    deliveryPublicKey: toHex(new Uint8Array(deliveryPublicKey)),
  };
}

export function patientRequestFor(identity: PatientIdentity): string {
  return encodeTransfer({
    type: "medproof-request-v2",
    network: MEDPROOF_DEPLOYMENT.network,
    contractAddress: requireContractAddress(),
    patientCommitment: identity.commitment,
    deliveryPublicKey: identity.deliveryPublicKey,
  });
}

type PatientRequest = {
  type: "medproof-request-v2";
  network: string;
  contractAddress: string;
  patientCommitment: string;
  deliveryPublicKey: string;
};

function parsePatientRequest(value: string): PatientRequest {
  let request: PatientRequest;
  try { request = decodeTransfer<PatientRequest>(value); } catch { throw new Error("Request code is invalid. Ask patient for a new code."); }
  if (request.type !== "medproof-request-v2") throw new Error("Old request code detected. Patient must create a new MedProof v2 request.");
  if (request.network !== MEDPROOF_DEPLOYMENT.network || request.contractAddress !== requireContractAddress()) {
    throw new Error("Request belongs to another network or contract. Patient must create a new request.");
  }
  if (fromHex(request.patientCommitment).length !== 32 || fromHex(request.deliveryPublicKey).length !== 65) {
    throw new Error("Request code is damaged. Ask patient for a new code.");
  }
  return request;
}

async function encryptDirections(plaintext: string, deliveryPublicKey: string): Promise<Uint8Array> {
  const encoded = encoder.encode(plaintext.trim());
  if (!encoded.length) throw new Error("Directions are required.");
  if (encoded.length > 220) throw new Error("Directions must be 220 bytes or fewer.");
  const patientPublicKey = await crypto.subtle.importKey(
    "raw", fromHex(deliveryPublicKey).buffer as ArrayBuffer, { name: "ECDH", namedCurve: "P-256" }, false, [],
  );
  const ephemeral = await crypto.subtle.generateKey({ name: "ECDH", namedCurve: "P-256" }, true, ["deriveKey"]);
  const key = await crypto.subtle.deriveKey(
    { name: "ECDH", public: patientPublicKey }, ephemeral.privateKey,
    { name: "AES-GCM", length: 256 }, false, ["encrypt"],
  );
  const iv = randomBytes(12);
  const ciphertext = new Uint8Array(await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, encoded));
  const publicKey = new Uint8Array(await crypto.subtle.exportKey("raw", ephemeral.publicKey));
  const packed = new Uint8Array(1 + publicKey.length + iv.length + ciphertext.length);
  packed[0] = 2;
  packed.set(publicKey, 1);
  packed.set(iv, 66);
  packed.set(ciphertext, 78);
  return packed;
}

async function decryptDirections(encrypted: Uint8Array, identity: PatientIdentity): Promise<string> {
  if (encrypted[0] !== 2 || encrypted.length < 95) throw new Error("Prescription encryption format is invalid.");
  const privateKey = await crypto.subtle.importKey(
    "jwk", identity.deliveryPrivateKey, { name: "ECDH", namedCurve: "P-256" }, false, ["deriveKey"],
  );
  const ephemeralPublicKey = await crypto.subtle.importKey(
    "raw", encrypted.slice(1, 66), { name: "ECDH", namedCurve: "P-256" }, false, [],
  );
  const key = await crypto.subtle.deriveKey(
    { name: "ECDH", public: ephemeralPublicKey }, privateKey,
    { name: "AES-GCM", length: 256 }, false, ["decrypt"],
  );
  const plaintext = await crypto.subtle.decrypt({ name: "AES-GCM", iv: encrypted.slice(66, 78) }, key, encrypted.slice(78));
  return new TextDecoder().decode(plaintext);
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
        timeoutId = window.setTimeout(() => reject(new Error("Midnight did not finalize transaction within 3 minutes.")), 180_000);
      }),
    ]);
  } finally {
    if (timeoutId) window.clearTimeout(timeoutId);
  }
}

async function finalizedCall<T>(session: ConnectedSession, compiledContract: unknown, circuitId: string, args: unknown[]) {
  const contractAddress = requireContractAddress();
  session.providers.privateStateProvider.setContractAddress(contractAddress);
  if (!(await session.providers.privateStateProvider.get(PRIVATE_STATE_ID))) {
    await session.providers.privateStateProvider.set(PRIVATE_STATE_ID, {});
  }
  const submitted = await (submitCallTxAsync as never as (
    providers: unknown,
    options: unknown,
  ) => Promise<{ txId: string; callTxData: { private: { result: T; nextPrivateState: unknown } } }>) (
    session.providers,
    { compiledContract, contractAddress, circuitId, args, privateStateId: PRIVATE_STATE_ID },
  );
  const finalized = await waitForFinality(session, submitted.txId);
  if (finalized.status !== SucceedEntirely) throw new Error(`${circuitId} failed on Midnight (${finalized.status}).`);
  await session.providers.privateStateProvider.set(PRIVATE_STATE_ID, submitted.callTxData.private.nextPrivateState);
  return { txId: submitted.txId, result: submitted.callTxData.private.result };
}

const unavailableCredential = () => { throw new Error("Patient credential unavailable for doctor transaction."); };

export async function issueOnChain(session: ConnectedSession, input: IssueInput): Promise<IssuedPrescription> {
  const contractAddress = requireContractAddress();
  const request = parsePatientRequest(input.patientRequest);
  const expiresAt = expirySeconds(input.expiresOn);
  const [secret, drugHash, encryptedDirections] = await Promise.all([
    doctorSecret(session), medicineHash(), encryptDirections(input.privateDirections, request.deliveryPublicKey),
  ]);
  const directionsHash = await hashBytes(encryptedDirections);
  const contractState = await session.providers.publicDataProvider.queryContractState(contractAddress);
  if (!contractState) throw new Error("Configured MedProof v2 contract was not found on preprod.");
  const deployedLedger = MedProof.ledger(contractState.data);
  if (deployedLedger.version !== BigInt(2)) throw new Error("Configured address is not MedProof v2. Deploy current contract first.");
  if (!equalBytes(contractMath()._doctorKey_0(secret), deployedLedger.doctorPk)) {
    throw new Error("This wallet is not the hospital issuer. Connect the wallet used to deploy MedProof v2.");
  }
  if (!equalBytes(drugHash, deployedLedger.supportedDrugHash)) {
    throw new Error("Contract medicine policy differs from this app. Deploy MedProof v2 again.");
  }

  const prescriptionNonce = randomBytes(32);
  const witnesses = {
    doctorSecretKey: <PS>(context: { privateState: PS }): [PS, Uint8Array] => [context.privateState, secret],
    prescriptionCredential: unavailableCredential,
  };
  const { txId, result } = await finalizedCall<Uint8Array>(
    session,
    compiledMedProof(witnesses as never),
    "issuePrescription",
    [fromHex(request.patientCommitment), expiresAt, directionsHash, prescriptionNonce],
  );
  const transfer = {
    type: "medproof-prescription-v2" as const,
    id: toHex(result),
    patientCommitment: request.patientCommitment,
    medicine: SUPPORTED_MEDICINE,
    expiresOn: input.expiresOn,
    fillsRemaining: 1,
    issuedAt: new Date().toISOString(),
    issueTransactionHash: txId,
    prescriptionNonce: toHex(prescriptionNonce),
    encryptedDirections: toHex(encryptedDirections),
    criteria: {
      patientCommit: request.patientCommitment,
      drugHash: toHex(drugHash),
      expiresAt: expiresAt.toString(),
      directionsHash: toHex(directionsHash),
    },
  };
  return {
    id: transfer.id,
    medicine: transfer.medicine,
    expiresOn: transfer.expiresOn,
    transactionHash: txId,
    patientPackage: encodeTransfer(transfer),
  };
}

type PrescriptionTransfer = Omit<PrescriptionRecord, "privateDirections"> & { type: "medproof-prescription-v2" };

export async function importPrescriptionPackage(identity: PatientIdentity, value: string): Promise<PrescriptionRecord> {
  let transfer: PrescriptionTransfer;
  try { transfer = decodeTransfer<PrescriptionTransfer>(value); } catch { throw new Error("Prescription code is invalid. Ask prescriber to copy it again."); }
  if (transfer.type !== "medproof-prescription-v2") throw new Error("Old prescription code detected. Prescriber must issue a new MedProof v2 prescription.");
  if (transfer.patientCommitment !== identity.commitment) throw new Error("Prescription belongs to another patient wallet.");
  const encrypted = fromHex(transfer.encryptedDirections);
  if (!equalBytes(await hashBytes(encrypted), fromHex(transfer.criteria.directionsHash))) {
    throw new Error("Prescription package integrity check failed.");
  }
  const privateDirections = await decryptDirections(encrypted, identity);
  const { type: _type, ...record } = transfer;
  void _type;
  return { ...record, privateDirections };
}

async function credentialFor(session: ConnectedSession, record: PrescriptionRecord, identity: PatientIdentity): Promise<Credential> {
  const contractAddress = requireContractAddress();
  if (identity.commitment !== record.patientCommitment) throw new Error("Connected patient does not own this prescription.");
  const state = await session.providers.publicDataProvider.queryContractState(contractAddress);
  if (!state) throw new Error("MedProof v2 contract state is unavailable.");
  const ledger = MedProof.ledger(state.data);
  if (ledger.version !== BigInt(2)) throw new Error("Configured address is not MedProof v2.");
  const path = ledger.prescriptions.findPathForLeaf(fromHex(record.id));
  if (!path) throw new Error("Prescription was not found in current contract. Ask prescriber to issue it again.");
  return {
    criteria: {
      patientCommit: fromHex(record.criteria.patientCommit),
      drugHash: fromHex(record.criteria.drugHash),
      expiresAt: BigInt(record.criteria.expiresAt),
      directionsHash: fromHex(record.criteria.directionsHash),
    },
    prescriptionNonce: fromHex(record.prescriptionNonce),
    patientSecret: fromHex(identity.secret),
    patientNonce: fromHex(identity.nonce),
    prescriptionPath: path,
  };
}

export async function fillOnChain(
  session: ConnectedSession,
  record: PrescriptionRecord,
  identity: PatientIdentity,
): Promise<{ prescription: PrescriptionRecord; fill: FillRecord }> {
  const credential = await credentialFor(session, record, identity);
  const witnesses = {
    doctorSecretKey: () => { throw new Error("Doctor witness unavailable for patient transaction."); },
    prescriptionCredential: <PS>(context: { privateState: PS }): [PS, Credential] => [context.privateState, credential],
  };
  const { txId, result } = await finalizedCall<Uint8Array>(
    session,
    compiledMedProof(witnesses as never),
    "fillPrescription",
    [],
  );
  if (!equalBytes(result, await medicineHash())) throw new Error("Contract returned unexpected medicine policy.");
  return {
    prescription: { ...record, fillsRemaining: 0 },
    fill: { medicine: SUPPORTED_MEDICINE, filledAt: new Date().toISOString(), transactionHash: txId, code: txId.toUpperCase() },
  };
}

export async function verifyFillOnChain(code: string): Promise<FillRecord> {
  const contractAddress = requireContractAddress();
  const txId = code.trim().toLowerCase().replace(/^0x/, "");
  if (!/^[0-9a-f]{64}$/.test(txId)) throw new Error("Enter the 64-character Midnight transaction ID.");
  const finalized = await createPreprodPublicDataProvider().watchForTxData(txId);
  if (finalized.status !== SucceedEntirely) throw new Error(`Fill transaction failed on Midnight (${finalized.status}).`);
  const isFill = Array.from(finalized.tx.intents?.values() ?? []).some((intent) =>
    intent.actions.some((action) =>
      "address" in action && "entryPoint" in action &&
      String(action.address) === contractAddress && action.entryPoint === "fillPrescription",
    ),
  );
  if (!isFill) throw new Error("Transaction is not a finalized MedProof fill.");
  return { medicine: SUPPORTED_MEDICINE, filledAt: new Date().toISOString(), transactionHash: txId, code: txId.toUpperCase() };
}

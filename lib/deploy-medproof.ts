"use client";

import { CompiledContract } from "@midnight-ntwrk/compact-js";
import { sampleSigningKey } from "@midnight-ntwrk/compact-runtime";
import { createUnprovenDeployTx, submitTxAsync } from "@midnight-ntwrk/midnight-js-contracts";
import { MedProof } from "@contract/index";
import { MIDNIGHT_NETWORK_ID, type ConnectedSession } from "@/lib/midnight";

export const PRIVATE_STATE_ID = "medproofPrivateState";
export const MEDICINE_IDENTIFIER = "medproof:medicine:methylphenidate-10mg";

const doctorSecrets = new WeakMap<ConnectedSession, Uint8Array>();

const deployOnlyWitnesses = {
  doctorSecretKey: () => {
    throw new Error("doctorSecretKey witness is unavailable during deployment.");
  },
  prescriptionCredential: () => {
    throw new Error("prescriptionCredential witness is unavailable during deployment.");
  },
};

export function compiledMedProof(witnesses: typeof deployOnlyWitnesses = deployOnlyWitnesses) {
  return CompiledContract.make("medproof", MedProof.Contract).pipe(
    CompiledContract.withWitnesses(witnesses),
    CompiledContract.withCompiledFileAssets("/zk/medproof/"),
  );
}

export async function sha256(value: string): Promise<Uint8Array> {
  return new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value)));
}

export async function doctorSecret(session: ConnectedSession): Promise<Uint8Array> {
  const cached = doctorSecrets.get(session);
  if (cached) return cached;
  const signature = await session.api.signData(
    `medproof:doctor-authority:v2|${MIDNIGHT_NETWORK_ID}`,
    { encoding: "text" },
  );
  const secret = await sha256(`medproof:doctor-secret:v2|${signature}`);
  doctorSecrets.set(session, secret);
  return secret;
}

export async function deployMedProof(session: ConnectedSession): Promise<string> {
  const compiledContract = compiledMedProof();
  const [secret, drugHash] = await Promise.all([
    doctorSecret(session),
    sha256(MEDICINE_IDENTIFIER),
  ]);
  const deployTxData = await (createUnprovenDeployTx as never as (
    providers: unknown,
    options: unknown,
  ) => Promise<{
    public: { contractAddress: string };
    private: { unprovenTx: unknown; initialPrivateState: Record<string, never>; signingKey: unknown };
  }>)(
    { zkConfigProvider: session.providers.zkConfigProvider, walletProvider: session.providers.walletProvider },
    {
      compiledContract,
      args: [secret, drugHash],
      privateStateId: PRIVATE_STATE_ID,
      initialPrivateState: {},
      signingKey: sampleSigningKey(),
    },
  );
  const contractAddress = deployTxData.public.contractAddress;
  await (submitTxAsync as never as (providers: unknown, options: unknown) => Promise<unknown>)(
    session.providers,
    { unprovenTx: deployTxData.private.unprovenTx },
  );
  await session.providers.privateStateProvider.setContractAddress(contractAddress);
  await session.providers.privateStateProvider.set(PRIVATE_STATE_ID, deployTxData.private.initialPrivateState);
  await session.providers.privateStateProvider.setSigningKey(contractAddress, deployTxData.private.signingKey);
  return contractAddress;
}

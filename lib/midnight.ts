"use client";

import { ContractState } from "@midnight-ntwrk/compact-runtime";
import { LedgerParameters, ZswapChainState } from "@midnight-ntwrk/ledger-v8";
import { indexerPublicDataProvider } from "@midnight-ntwrk/midnight-js-indexer-public-data-provider";
import { httpClientProofProvider } from "@midnight-ntwrk/midnight-js-http-client-proof-provider";
import { setNetworkId } from "@midnight-ntwrk/midnight-js-network-id";
import { FetchZkConfigProvider } from "@midnight-ntwrk/midnight-js-fetch-zk-config-provider";
import type { MidnightProvider, ProofProvider, WalletProvider } from "@midnight-ntwrk/midnight-js-types";
import { MEDPROOF_DEPLOYMENT } from "@/lib/deployment";

export const MIDNIGHT_NETWORK_ID = MEDPROOF_DEPLOYMENT.network;
export const MEDPROOF_ZK_ASSET_PATH = MEDPROOF_DEPLOYMENT.zkAssetPath;

// Set explicit network before extension detection, connection, or SDK work.
setNetworkId(MIDNIGHT_NETWORK_ID);

type OneAmWallet = { connect(network: typeof MIDNIGHT_NETWORK_ID): Promise<OneAmApi> };
type OneAmApi = {
  getConfiguration(): Promise<{
    networkId: string;
    indexerUri: string;
    indexerWsUri: string;
    proverServerUri: string;
  }>;
  getUnshieldedAddress(): Promise<{ unshieldedAddress: string }>;
  getShieldedAddresses(): Promise<{
    shieldedCoinPublicKey: string;
    shieldedEncryptionPublicKey: string;
  }>;
  balanceUnsealedTransaction(tx: string): Promise<{ tx: string }>;
  submitTransaction(tx: string): Promise<string | { transactionId?: string; id?: string } | undefined>;
  signData(data: string, options: { encoding: "text" }): Promise<string>;
};

declare global {
  interface Window {
    midnight?: { "1am"?: OneAmWallet };
  }
}

export type ConnectedSession = {
  api: OneAmApi;
  config: Awaited<ReturnType<OneAmApi["getConfiguration"]>>;
  providers: {
    privateStateProvider: ReturnType<typeof createPrivateStateProvider>;
    publicDataProvider: ReturnType<typeof createPatchedPublicDataProvider>;
    zkConfigProvider: FetchZkConfigProvider<never>;
    proofProvider: ProofProvider;
    walletProvider: WalletProvider;
    midnightProvider: MidnightProvider;
  };
  unshieldedAddress: string;
};

export function toHex(bytes: Uint8Array): string {
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

export function fromHex(hex: string): Uint8Array {
  const normalized = hex.startsWith("0x") ? hex.slice(2) : hex;
  if (normalized.length % 2 !== 0 || !/^[0-9a-f]*$/i.test(normalized)) throw new Error("Invalid hex string from wallet.");
  const bytes = new Uint8Array(normalized.length / 2);
  for (let index = 0; index < normalized.length; index += 2) {
    bytes[index / 2] = Number.parseInt(normalized.slice(index, index + 2), 16);
  }
  return bytes;
}

export function detectOneAmWallet(): Promise<OneAmWallet | null> {
  setNetworkId(MIDNIGHT_NETWORK_ID);
  return new Promise((resolve) => {
    let attempts = 0;
    const check = () => {
      const wallet = window.midnight?.["1am"];
      if (wallet) return resolve(wallet);
      if (++attempts > 50) return resolve(null);
      window.setTimeout(check, 100);
    };
    check();
  });
}

function createPrivateStateProvider() {
  let scope = "";
  const stateStore = new Map<string, unknown>();
  const signingKeyStore = new Map<string, unknown>();
  const key = (id: string) => `${scope}:${id}`;
  return {
    setContractAddress(address: string) { scope = address; },
    async set(id: string, state: unknown) { stateStore.set(key(id), state); },
    async get(id: string) { return stateStore.get(key(id)) ?? null; },
    async remove(id: string) { stateStore.delete(key(id)); },
    async clear() { stateStore.clear(); },
    async setSigningKey(address: string, signingKey: unknown) { signingKeyStore.set(address, signingKey); },
    async getSigningKey(address: string) { return signingKeyStore.get(address) ?? null; },
    async removeSigningKey(address: string) { signingKeyStore.delete(address); },
    async clearSigningKeys() { signingKeyStore.clear(); },
    async exportPrivateStates(): Promise<never> { throw new Error("Not implemented."); },
    async importPrivateStates(): Promise<never> { throw new Error("Not implemented."); },
    async exportSigningKeys(): Promise<never> { throw new Error("Not implemented."); },
    async importSigningKeys(): Promise<never> { throw new Error("Not implemented."); },
  };
}

function createPatchedPublicDataProvider(queryUrl: string, subscriptionUrl: string) {
  const base = indexerPublicDataProvider(queryUrl, subscriptionUrl);
  async function queryLatest(query: string, address: string) {
    const response = await fetch(queryUrl, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ query, variables: { address } }),
    });
    if (!response.ok) throw new Error(`Indexer HTTP error: ${response.status}`);
    const payload = await response.json();
    if (payload.errors?.length) {
      throw new Error(payload.errors.map((error: { message: string }) => error.message).join("; "));
    }
    return payload.data?.contractAction ?? null;
  }
  return {
    ...base,
    async queryContractState(contractAddress: string, config?: unknown) {
      if (config) return base.queryContractState(contractAddress, config as never);
      const action = await queryLatest(
        `query LATEST_CONTRACT_STATE($address: HexEncoded!) { contractAction(address: $address) { state } }`,
        contractAddress,
      );
      return action ? ContractState.deserialize(fromHex(action.state)) : null;
    },
    async queryZSwapAndContractState(contractAddress: string, config?: unknown) {
      if (config) return base.queryZSwapAndContractState(contractAddress, config as never);
      const action = await queryLatest(
        `query LATEST_BOTH_STATE($address: HexEncoded!) {
          contractAction(address: $address) {
            state zswapState transaction { block { ledgerParameters } }
          }
        }`,
        contractAddress,
      );
      if (!action?.zswapState) return null;
      return [
        ZswapChainState.deserialize(fromHex(action.zswapState)),
        ContractState.deserialize(fromHex(action.state)),
        action.transaction?.block?.ledgerParameters
          ? LedgerParameters.deserialize(fromHex(action.transaction.block.ledgerParameters))
          : LedgerParameters.initialParameters(),
      ] as const;
    },
  };
}

export function createPreprodPublicDataProvider() {
  return createPatchedPublicDataProvider(MEDPROOF_DEPLOYMENT.indexerUri, MEDPROOF_DEPLOYMENT.indexerWsUri);
}

export async function connectOneAmPreprod(): Promise<ConnectedSession> {
  setNetworkId(MIDNIGHT_NETWORK_ID);
  const wallet = await detectOneAmWallet();
  if (!wallet) throw new Error("1AM wallet not detected. Install the browser extension first.");

  const api = await wallet.connect(MIDNIGHT_NETWORK_ID);
  const config = await api.getConfiguration();
  if (config.networkId !== MIDNIGHT_NETWORK_ID) {
    throw new Error(`Wallet connected to ${config.networkId}. Switch 1AM to preprod and reconnect.`);
  }
  setNetworkId(MIDNIGHT_NETWORK_ID);

  const [unshieldedAddress, shieldedAddress] = await Promise.all([
    api.getUnshieldedAddress(),
    api.getShieldedAddresses(),
  ]);
  const zkConfigProvider = new FetchZkConfigProvider<never>(
    new URL(MEDPROOF_ZK_ASSET_PATH, window.location.origin).toString(),
    window.fetch.bind(window),
  );
  if (!config.proverServerUri) {
    throw new Error("1AM did not provide its ProofStation URL. Update 1AM and reconnect.");
  }
  const proofProvider = httpClientProofProvider(config.proverServerUri, zkConfigProvider);
  const walletProvider: WalletProvider = {
    getCoinPublicKey: () => shieldedAddress.shieldedCoinPublicKey,
    getEncryptionPublicKey: () => shieldedAddress.shieldedEncryptionPublicKey,
    balanceTx: async (transaction: { serialize(): Uint8Array }) => {
      const balanced = await api.balanceUnsealedTransaction(toHex(transaction.serialize()));
      if (!balanced?.tx) throw new Error("1AM returned an invalid balanced transaction.");
      const { Transaction } = await import("@midnight-ntwrk/ledger-v8");
      return Transaction.deserialize("signature", "proof", "binding", fromHex(balanced.tx));
    },
  } as WalletProvider;
  const midnightProvider: MidnightProvider = {
    submitTx: async (transaction: { serialize(): Uint8Array; identifiers(): string[] }) => {
      const transactionHex = toHex(transaction.serialize());
      const canonicalTxId = transaction.identifiers()[0];
      const result = await api.submitTransaction(transactionHex);
      if (typeof result === "string" && result) return result;
      if (result && typeof result === "object" && result.transactionId) return result.transactionId;
      if (result && typeof result === "object" && result.id) return result.id;
      if (canonicalTxId) return canonicalTxId;
      throw new Error("Submitted transaction has no canonical Midnight identifier.");
    },
  } as MidnightProvider;

  return {
    api,
    config,
    providers: {
      privateStateProvider: createPrivateStateProvider(),
      publicDataProvider: createPatchedPublicDataProvider(config.indexerUri, config.indexerWsUri),
      zkConfigProvider,
      proofProvider,
      walletProvider,
      midnightProvider,
    },
    unshieldedAddress: unshieldedAddress.unshieldedAddress,
  };
}

export async function pollForContractState(
  queryUrl: string,
  contractAddress: string,
  onAttempt?: (attempt: number) => void,
  maxAttempts = 90,
): Promise<void> {
  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    onAttempt?.(attempt);
    const response = await fetch(queryUrl, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        query: `query($address: HexEncoded!) { contractAction(address: $address) { state } }`,
        variables: { address: contractAddress },
      }),
    });
    const payload = await response.json();
    if (payload?.data?.contractAction?.state) return;
    await new Promise((resolve) => window.setTimeout(resolve, 2_000));
  }
  throw new Error("Contract submitted but preprod indexer did not confirm it within 3 minutes.");
}

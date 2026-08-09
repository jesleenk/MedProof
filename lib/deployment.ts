export const MEDPROOF_DEPLOYMENT = {
  network: "preprod",
  contractAddress: process.env.NEXT_PUBLIC_MEDPROOF_CONTRACT_ADDRESS?.trim() ?? "916ad8b74ead2c71bcfae68f63431ad2d8c5ececbf93e73be8f3f2f3b709c7c1",
  indexerUri: "https://indexer.preprod.midnight.network/api/v4/graphql",
  indexerWsUri: "wss://indexer.preprod.midnight.network/api/v4/graphql/ws",
  zkAssetPath: "/zk/medproof/",
} as const;

const LOCAL_CONTRACT_KEY = "medproof:v2:contract-address";

export function configuredContractAddress() {
  if (MEDPROOF_DEPLOYMENT.contractAddress) return MEDPROOF_DEPLOYMENT.contractAddress;
  if (typeof window !== "undefined") return window.localStorage.getItem(LOCAL_CONTRACT_KEY)?.trim() ?? "";
  return "";
}

export function saveLocalContractAddress(address: string) {
  window.localStorage.setItem(LOCAL_CONTRACT_KEY, address.trim());
}

export function shortContractAddress(address = configuredContractAddress()) {
  if (!address) return "Not configured";
  return `${address.slice(0, 8)}…${address.slice(-8)}`;
}

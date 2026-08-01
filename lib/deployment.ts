export const MEDPROOF_DEPLOYMENT = {
  network: "preprod",
  contractAddress: "676c33707151cb582206f114d91e248e920ab1a9ce0232bdc9c051afff14180f",
  zkAssetPath: "/zk/medproof/",
} as const;

export function shortContractAddress(address = MEDPROOF_DEPLOYMENT.contractAddress) {
  return `${address.slice(0, 8)}…${address.slice(-8)}`;
}

# MedProof

Private prescription verification on Midnight. Doctors issue encrypted credentials, patients generate selective proofs, and pharmacists verify eligibility without seeing medical history.

## Deployed contract

Midnight preprod:

```text
676c33707151cb582206f114d91e248e920ab1a9ce0232bdc9c051afff14180f
```

Application-wide deployment config lives in `lib/deployment.ts`.

## Preprod deployment

MedProof deploys only from `/deploy` through the 1AM browser extension. There is no server-side deployer, deploy mnemonic, funded backend wallet, or local proof-server requirement.

### Prerequisites

- Node.js 22 or newer
- Compact compiler `0.31.1`
- 1AM browser extension from [1am.xyz](https://1am.xyz)
- 1AM configured for Midnight `preprod`

### Run

```bash
npm install
npm run dev
```

Open [http://localhost:3000/deploy](http://localhost:3000/deploy).

1. Select `preprod` in 1AM.
2. Click **Connect 1AM on preprod**.
3. Approve the extension connection.
4. Click **Deploy MedProof contract**.
5. 1AM supplies the proving provider, ProofStation sponsorship, transaction balancing, and submission.
6. Wait for preprod indexer confirmation.
7. Copy the contract address displayed on the success screen.

Network ID is set to `preprod` before wallet detection, wallet connection, provider creation, or contract deployment.

## Deployment flow

```text
Browser creates unproven deploy transaction
  → 1AM proving provider generates proof
  → 1AM balances and sponsors transaction
  → 1AM submits transaction to Midnight preprod
  → app polls preprod indexer
  → deployed contract address remains visible
```

Constructor doctor authority is derived from a wallet signature scoped to MedProof and preprod. Supported medicine hash is generated client-side. Neither secret is sent to an application server.

## Contract bundle compatibility

Generated metadata:

- Compact compiler: `0.31.1`
- Compact language: `0.23.0`
- Compact runtime: `0.16.0`

`@midnight-ntwrk/compact-runtime` is pinned to `0.16.0` because runtime follows generated contract bundle. Recompile contract before changing this version.

## Commands

```bash
npm run compile      # compile MedProof.compact
npm run sync:assets  # copy prover/verifier/zkir assets to public/zk/medproof
npm run dev          # sync assets and start Next.js with webpack
npm run lint
npm run build        # compile, sync assets, build frontend
```

`npm run build` hosts required browser proving assets under `/zk/medproof/` with CORS enabled.

## Application routes

- `/` — product and privacy overview
- `/deploy` — 1AM preprod browser deployment
- `/doctor/issue` — prescription issuance
- `/wallet` — patient credentials and proof generation
- `/pharmacy` — verification and dispensing

## Live prescription flow

All state-changing actions use deployed preprod contract. No simulated transaction gateway remains.

1. Open `/wallet`, create patient identity, and copy 32-byte commitment. Private secret and nonce stay in browser storage.
2. Connect authorized 1AM wallet on `preprod`. This must be same doctor authority wallet used for contract deployment.
3. Open `/doctor/issue`, use patient commitment, then approve proving, balancing, and submission in 1AM.
4. Return to `/wallet` and generate pharmacy proof. App loads prescription Merkle path from preprod, supplies private credential witness, submits `proveValidPrescription`, and waits for finalization.
5. Open `/pharmacy` and verify proof transaction ID against Midnight finality.
6. Patient approves **Patient authorize dispense** from device holding credential. App calls `dispense`; contract records one-time nullifier and blocks replay.

This build keeps patient credential on originating browser. Moving credential between devices needs dedicated encrypted wallet backup/import and is intentionally not emulated.

## Reference pattern

Deployment follows [tusharpamnani/midnight-skills-counter-dapp](https://github.com/tusharpamnani/midnight-skills-counter-dapp): async 1AM detection, explicit network selection, wallet-provided proving, `createUnprovenDeployTx`, `submitTxAsync`, browser-hosted ZK assets, patched preprod indexer access, and post-submit polling.

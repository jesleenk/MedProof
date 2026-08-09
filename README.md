# MedProof v2

Private, one-time prescription filling on Midnight preprod. Hospital issues an anonymous commitment. Patient proves ownership and consumes prescription in one transaction. Pharmacy verifies finalized fill without receiving patient identity, directions, diagnosis, or medication history.

## Real workflow

No simulation, dummy records, or server wallet.

1. Patient opens `/wallet` and approves one 1AM message to create private request.
2. Hospital opens `/doctor/issue`, pastes request, enters expiry and directions, then issues through authorized 1AM wallet.
3. Hospital sends encrypted prescription code to patient.
4. Patient imports code and selects **Fill prescription** at pharmacy counter.
5. `fillPrescription` proves issuance, ownership, medicine, expiry, and unused status; same transaction records one-time nullifier.
6. Pharmacy opens `/pharmacy` and verifies fill transaction directly against Midnight. Pharmacy wallet is not required.

## Contract

`contract/MedProof.compact` has two exported circuits:

- `issuePrescription` — authorized hospital wallet inserts anonymous prescription commitment.
- `fillPrescription` — patient supplies private credential, proves validity, and atomically consumes one fill.

Public ledger state:

- contract version (`2`)
- hospital authorization key
- configured medicine hash
- prescription commitment tree
- filled-prescription nullifier set

Encrypted directions travel directly hospital-to-patient. Only their hash is committed inside private prescription credential; ciphertext is not stored on-chain.

## Deploy current contract

Old contract addresses are intentionally rejected. Start app without an address:

```bash
npm install
npm run dev
```

Open [http://localhost:3000/deploy](http://localhost:3000/deploy), select `preprod` in 1AM, connect, and select **Deploy MedProof v2**. After indexer confirms deployment, restart with returned address:

```bash
NEXT_PUBLIC_MEDPROOF_CONTRACT_ADDRESS=<confirmed-address> npm run dev
```

Wallet used for deployment becomes hospital issuer. Use same 1AM account on `/doctor/issue`.

## Transaction providers

```text
DApp builds unproven transaction
  → Midnight HTTP provider uses 1AM-configured ProofStation
  → 1AM sponsors and balances transaction
  → 1AM submits to Midnight preprod
  → app waits for indexer finality
```

Provider versions are pinned. Generated assets are deleted and replaced on every compile/build so removed circuits cannot leave stale proving keys.

## Commands

```bash
npm run compile
npm run sync:assets
npm run lint
npm run build
npm run dev
```

## Privacy and recovery

Patient wallet-derived identity, delivery private key, decrypted directions, and imported credential remain in current browser session. Production recovery requires wallet-supported encrypted private-state backup. App does not emulate custody with `localStorage` or fabricated data.

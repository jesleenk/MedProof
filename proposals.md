# MedProof Product Proposal

## Submission summary

- Challenge idea category: **Confidential Credentials**
- Product: **MedProof**
- Network: Midnight `preprod`
- Status: Working MVP
- Live dApp: [med-proof-phi.vercel.app](https://med-proof-phi.vercel.app/)
- Repository: [github.com/jesleenk/MedProof](https://github.com/jesleenk/MedProof)
- Product X profile: [x.com/Medproof_](https://x.com/Medproof_)
- Demo video: [Watch on Google Drive](https://drive.google.com/file/d/1aLBJQPQeKt6wSrIvZx74HYKiMfbXBm6u/view?usp=sharing)
- Contract address: `916ad8b74ead2c71bcfae68f63431ad2d8c5ececbf93e73be8f3f2f3b709c7c1`

Product screenshots: [landing](docs/screenshots/medproof-home.png), [patient](docs/screenshots/medproof-patient.png), [prescriber](docs/screenshots/medproof-prescriber.png), and [pharmacy](docs/screenshots/medproof-pharmacy.png).

## One-line proposal

MedProof lets an authorized hospital issue a confidential prescription credential that a patient can prove and consume once without publishing patient identity or private directions.

## Problem

Prescription workflows need two properties that normally conflict:

1. Pharmacy must verify that a real prescriber issued a valid, unexpired prescription.
2. Patient should not expose identity and sensitive clinical instructions to a public ledger or unrelated observers.

Paper documents and ordinary public-chain records also create replay risk: the same prescription can be copied or presented more than once. A centralized database can prevent replay, but it becomes a trusted custodian of medical identity and history.

## Proposed solution

MedProof represents each prescription as a private credential backed by a public anonymous commitment on Midnight.

- Hospital proves authorization and publishes prescription commitment.
- Patient receives encrypted prescription package directly from hospital.
- Patient proves credential ownership and validity with private witnesses.
- Successful fill atomically records anonymous nullifier.
- Pharmacy verifies finalized Midnight transaction without learning patient identity or directions.

Midnight contract state—not mock data, browser simulation, or private server—is source of truth.

## Intended users

### Hospital or prescriber

Issues prescription through authorized 1AM wallet. Handles patient request code, expiry, and directions without needing patient public wallet address.

### Patient

Creates private request, receives encrypted credential, and authorizes one-time fill while keeping identity and prescription details private.

### Pharmacy

Checks finalized fill transaction against Midnight indexer. No pharmacy wallet or access to patient private data required.

## User journey

1. Patient connects 1AM and signs scoped MedProof message.
2. Browser derives patient secret and anonymous commitment locally.
3. Patient sends request code to hospital.
4. Hospital issues prescription using authorized wallet.
5. Midnight records anonymous prescription commitment.
6. Hospital sends encrypted prescription package to patient.
7. Patient imports package and submits one `fillPrescription` proof.
8. Contract validates credential and records one-time nullifier atomically.
9. Pharmacy verifies transaction ID from finalized preprod data.

## Why Midnight

Public blockchains can prove that a transaction occurred, but publishing prescription data would expose sensitive health information. A traditional private database hides data but requires every participant to trust one operator.

Midnight provides needed middle ground:

- Publicly verifiable contract execution.
- Private witnesses for patient secrets and credential data.
- Selective disclosure of validity rather than underlying medical data.
- Public replay protection through anonymous nullifiers.
- Wallet-authorized transactions without server custody.

## Privacy model

### Publicly disclosed

- Contract address and version.
- Authorized hospital public commitment.
- Supported medicine hash.
- Anonymous prescription commitment.
- Anonymous consumed-prescription nullifier.
- Transaction timing and ordinary network metadata.

### Kept private

- Patient name and wallet address.
- Patient secret and commitment nonce.
- Delivery private key.
- Prescription directions plaintext.
- Prescription nonce and private credential witness.
- Direct link between real patient and on-chain commitment.

### Directly shared

Encrypted prescription package travels hospital-to-patient. Directions use browser-side ECDH P-256 key agreement and AES-GCM encryption. Only directions hash participates in credential commitment; ciphertext is not stored on-chain.

## Contract design

MedProof v2 exposes two proof-producing Compact circuits.

### `issuePrescription`

- Verifies hospital secret against authorized public commitment.
- Rejects expiry in past.
- Commits patient commitment, medicine hash, expiry, and directions hash.
- Inserts anonymous prescription ID into historic Merkle tree.

### `fillPrescription`

- Verifies prescription exists in issued Merkle tree.
- Proves private credential belongs to patient secret.
- Verifies configured medicine.
- Rejects expired prescription.
- Rejects previously used nullifier.
- Inserts fill nullifier in same transaction.

Atomic consumption avoids split proof/dispense state where one transaction succeeds and second fails.

## MVP scope

Included:

- Real 1AM wallet connection.
- Midnight preprod deployment.
- Hospital authorization.
- Anonymous prescription issuance.
- Browser-side encrypted directions.
- Patient-owned private credential.
- Atomic one-time fill proof.
- Pharmacy verification using finalized transaction ID.
- Contract compilation, four tests, lint, build, and passing GitHub Actions CI.
- Public Vercel deployment and product X profile.

Not included in current MVP:

- Multiple medicines per deployment.
- Prescription refills greater than one.
- Hospital key rotation or multi-prescriber registry.
- Wallet-backed encrypted private-state recovery.
- Production healthcare compliance certification.

## Security and misuse controls

- Only deployment-authorized hospital secret can issue.
- Expired prescriptions fail contract checks.
- Patient commitment binds credential to private patient secret.
- Nullifier prevents a second successful fill.
- Version and contract-address checks reject stale request packages.
- Pharmacy accepts only finalized action for configured contract.
- App contains no server wallet and no fabricated fallback records.

## Success criteria

MVP succeeds when:

1. Hospital can issue real prescription commitment on preprod.
2. Patient can privately fill valid prescription once.
3. Second fill attempt fails replay protection.
4. Pharmacy can verify finalized transaction without patient identity.
5. Observer cannot recover private directions or patient secret from ledger.
6. Contract compile, tests, lint, and production build pass in CI.

## Testing and delivery

Four deterministic guardrail tests verify:

1. Compiled circuit surface contains only v2 issue and atomic fill circuits.
2. Public ledger excludes patient identity and private prescription fields.
3. Fill circuit enforces issuance, ownership, medicine, expiry, and replay protection.
4. Preprod configuration and ZK assets match compiled circuits.

![MedProof test output showing four passing tests](docs/screenshots/medproof-tests.png)

GitHub Actions runs dependency installation, Compact compilation, asset synchronization, tests, ESLint, and production build on every push and pull request.

## Roadmap

### Next

- Wallet-backed encrypted private-state recovery.
- Multiple medicine identifiers and configurable fill count.
- Prescriber registry with role rotation and revocation.
- Better pharmacy receipts and explorer links.

### Later

- Multi-hospital federation.
- Prescription revocation circuit.
- Selective audit disclosure with patient consent.
- Security review and regulated-healthcare deployment assessment.

## Challenge fit

MedProof directly implements **Confidential Credentials** from provided idea list. Privacy is core product behavior, not cosmetic addition: app proves prescription validity while withholding patient identity and clinical directions. Public data is limited to authorization, commitments, and replay-prevention state needed for independent verification.

import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import test from "node:test";

const CONTRACT_PATH = new URL("../contract/MedProof.compact", import.meta.url);
const CONTRACT_INFO_PATH = new URL("../contract/managed/medproof/compiler/contract-info.json", import.meta.url);
const DEPLOYMENT_PATH = new URL("../lib/deployment.ts", import.meta.url);
const KEYS_PATH = new URL("../contract/managed/medproof/keys/", import.meta.url);
const ZKIR_PATH = new URL("../contract/managed/medproof/zkir/", import.meta.url);

const contractSource = await readFile(CONTRACT_PATH, "utf8");
const contractInfo = JSON.parse(await readFile(CONTRACT_INFO_PATH, "utf8"));

test("compiled contract exposes only v2 issue and atomic fill proof circuits", () => {
  assert.deepEqual(
    contractInfo.circuits.map(({ name, proof }) => ({ name, proof })),
    [
      { name: "issuePrescription", proof: true },
      { name: "fillPrescription", proof: true },
    ],
  );
  assert.match(contractSource, /version = 2;/);
  assert.doesNotMatch(contractSource, /export circuit (prove|dispense)Prescription/);
});

test("public ledger excludes patient identity, directions, dates, and ciphertext", () => {
  const ledgers = [...contractSource.matchAll(/export ledger\s+(\w+)/g)].map((match) => match[1]);
  assert.deepEqual(ledgers, [
    "doctorPk",
    "supportedDrugHash",
    "version",
    "prescriptions",
    "filledPrescriptions",
  ]);
  for (const forbidden of ["patientSecret", "patientNonce", "deliveryPrivateKey", "privateDirections", "ciphertext"]) {
    assert.ok(!ledgers.includes(forbidden), `${forbidden} must not be public ledger state`);
  }
});

test("fill circuit enforces issuance, ownership, medicine, expiry, and replay protection", () => {
  for (const invariant of ["issued && correctLeaf", "correctPatient", "correctDrug", "notExpired"]) {
    assert.match(contractSource, new RegExp(`assert\\(disclose\\(${invariant.replace(/[&]/g, "\\&")}\\)`));
  }
  assert.match(contractSource, /assert\(!filledPrescriptions\.member\(nullifier\)/);
  assert.match(contractSource, /filledPrescriptions\.insert\(nullifier\)/);
});

test("preprod deployment and generated ZK assets match both circuits", async () => {
  const deployment = await readFile(DEPLOYMENT_PATH, "utf8");
  assert.match(deployment, /network: "preprod"/);
  assert.match(deployment, /916ad8b74ead2c71bcfae68f63431ad2d8c5ececbf93e73be8f3f2f3b709c7c1/);

  assert.deepEqual((await readdir(KEYS_PATH)).sort(), [
    "fillPrescription.prover",
    "fillPrescription.verifier",
    "issuePrescription.prover",
    "issuePrescription.verifier",
  ]);
  assert.deepEqual((await readdir(ZKIR_PATH)).sort(), [
    "fillPrescription.bzkir",
    "fillPrescription.zkir",
    "issuePrescription.bzkir",
    "issuePrescription.zkir",
  ]);
});

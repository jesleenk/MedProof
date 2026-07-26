import type * as __compactRuntime from '@midnight-ntwrk/compact-runtime';

export type Witnesses<PS> = {
  doctorSecretKey(context: __compactRuntime.WitnessContext<Ledger, PS>): [PS, Uint8Array];
  prescriptionCredential(context: __compactRuntime.WitnessContext<Ledger, PS>): [PS, { criteria: { patientCommit: Uint8Array,
                                                                                                   drugHash: Uint8Array,
                                                                                                   validFrom: bigint,
                                                                                                   validUntil: bigint,
                                                                                                   refillsTotal: bigint
                                                                                                 },
                                                                                       prescriptionNonce: Uint8Array,
                                                                                       patientSecret: Uint8Array,
                                                                                       patientNonce: Uint8Array,
                                                                                       prescriptionPath: { leaf: Uint8Array,
                                                                                                           path: { sibling: { field: bigint
                                                                                                                            },
                                                                                                                   goes_left: boolean
                                                                                                                 }[]
                                                                                                         }
                                                                                     }];
}

export type ImpureCircuits<PS> = {
  issuePrescription(context: __compactRuntime.CircuitContext<PS>,
                    patientCommit_0: Uint8Array,
                    validFrom_0: bigint,
                    validUntil_0: bigint,
                    encryptedDetails_0: Uint8Array,
                    prescriptionNonce_0: Uint8Array): __compactRuntime.CircuitResults<PS, Uint8Array>;
  proveValidPrescription(context: __compactRuntime.CircuitContext<PS>,
                         requestedDrugHash_0: Uint8Array): __compactRuntime.CircuitResults<PS, { valid: boolean,
                                                                                                 drugHash: Uint8Array,
                                                                                                 refillsRemaining: bigint
                                                                                               }>;
  dispense(context: __compactRuntime.CircuitContext<PS>,
           requestedDrugHash_0: Uint8Array): __compactRuntime.CircuitResults<PS, bigint>;
}

export type ProvableCircuits<PS> = {
  issuePrescription(context: __compactRuntime.CircuitContext<PS>,
                    patientCommit_0: Uint8Array,
                    validFrom_0: bigint,
                    validUntil_0: bigint,
                    encryptedDetails_0: Uint8Array,
                    prescriptionNonce_0: Uint8Array): __compactRuntime.CircuitResults<PS, Uint8Array>;
  proveValidPrescription(context: __compactRuntime.CircuitContext<PS>,
                         requestedDrugHash_0: Uint8Array): __compactRuntime.CircuitResults<PS, { valid: boolean,
                                                                                                 drugHash: Uint8Array,
                                                                                                 refillsRemaining: bigint
                                                                                               }>;
  dispense(context: __compactRuntime.CircuitContext<PS>,
           requestedDrugHash_0: Uint8Array): __compactRuntime.CircuitResults<PS, bigint>;
}

export type PureCircuits = {
}

export type Circuits<PS> = {
  issuePrescription(context: __compactRuntime.CircuitContext<PS>,
                    patientCommit_0: Uint8Array,
                    validFrom_0: bigint,
                    validUntil_0: bigint,
                    encryptedDetails_0: Uint8Array,
                    prescriptionNonce_0: Uint8Array): __compactRuntime.CircuitResults<PS, Uint8Array>;
  proveValidPrescription(context: __compactRuntime.CircuitContext<PS>,
                         requestedDrugHash_0: Uint8Array): __compactRuntime.CircuitResults<PS, { valid: boolean,
                                                                                                 drugHash: Uint8Array,
                                                                                                 refillsRemaining: bigint
                                                                                               }>;
  dispense(context: __compactRuntime.CircuitContext<PS>,
           requestedDrugHash_0: Uint8Array): __compactRuntime.CircuitResults<PS, bigint>;
}

export type Ledger = {
  readonly doctorPk: Uint8Array;
  readonly supportedDrugHash: Uint8Array;
  issuedPrescriptions: {
    isFull(): boolean;
    checkRoot(rt_0: { field: bigint }): boolean;
    root(): __compactRuntime.MerkleTreeDigest;
    firstFree(): bigint;
    pathForLeaf(index_0: bigint, leaf_0: Uint8Array): __compactRuntime.MerkleTreePath<Uint8Array>;
    findPathForLeaf(leaf_0: Uint8Array): __compactRuntime.MerkleTreePath<Uint8Array> | undefined;
    history(): Iterator<__compactRuntime.MerkleTreeDigest>
  };
  encryptedPrescriptions: {
    isEmpty(): boolean;
    size(): bigint;
    member(key_0: Uint8Array): boolean;
    lookup(key_0: Uint8Array): Uint8Array;
    [Symbol.iterator](): Iterator<[Uint8Array, Uint8Array]>
  };
  usedDispenses: {
    isEmpty(): boolean;
    size(): bigint;
    member(elem_0: Uint8Array): boolean;
    [Symbol.iterator](): Iterator<Uint8Array>
  };
}

export type ContractReferenceLocations = any;

export declare const contractReferenceLocations : ContractReferenceLocations;

export declare class Contract<PS = any, W extends Witnesses<PS> = Witnesses<PS>> {
  witnesses: W;
  circuits: Circuits<PS>;
  impureCircuits: ImpureCircuits<PS>;
  provableCircuits: ProvableCircuits<PS>;
  constructor(witnesses: W);
  initialState(context: __compactRuntime.ConstructorContext<PS>,
               doctorSecret_0: Uint8Array,
               drugHash_0: Uint8Array): __compactRuntime.ConstructorResult<PS>;
}

export declare function ledger(state: __compactRuntime.StateValue | __compactRuntime.ChargedState): Ledger;
export declare const pureCircuits: PureCircuits;

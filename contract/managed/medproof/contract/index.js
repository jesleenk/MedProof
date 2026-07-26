import * as __compactRuntime from '@midnight-ntwrk/compact-runtime';
__compactRuntime.checkRuntimeVersion('0.16.0');

const _descriptor_0 = new __compactRuntime.CompactTypeBytes(32);

const _descriptor_1 = __compactRuntime.CompactTypeBoolean;

const _descriptor_2 = __compactRuntime.CompactTypeField;

class _MerkleTreeDigest_0 {
  alignment() {
    return _descriptor_2.alignment();
  }
  fromValue(value_0) {
    return {
      field: _descriptor_2.fromValue(value_0)
    }
  }
  toValue(value_0) {
    return _descriptor_2.toValue(value_0.field);
  }
}

const _descriptor_3 = new _MerkleTreeDigest_0();

const _descriptor_4 = new __compactRuntime.CompactTypeUnsignedInteger(255n, 1);

class _VerifyResult_0 {
  alignment() {
    return _descriptor_1.alignment().concat(_descriptor_0.alignment().concat(_descriptor_4.alignment()));
  }
  fromValue(value_0) {
    return {
      valid: _descriptor_1.fromValue(value_0),
      drugHash: _descriptor_0.fromValue(value_0),
      refillsRemaining: _descriptor_4.fromValue(value_0)
    }
  }
  toValue(value_0) {
    return _descriptor_1.toValue(value_0.valid).concat(_descriptor_0.toValue(value_0.drugHash).concat(_descriptor_4.toValue(value_0.refillsRemaining)));
  }
}

const _descriptor_5 = new _VerifyResult_0();

const _descriptor_6 = new __compactRuntime.CompactTypeBytes(256);

const _descriptor_7 = new __compactRuntime.CompactTypeUnsignedInteger(18446744073709551615n, 8);

class _PrescriptionCriteria_0 {
  alignment() {
    return _descriptor_0.alignment().concat(_descriptor_0.alignment().concat(_descriptor_7.alignment().concat(_descriptor_7.alignment().concat(_descriptor_4.alignment()))));
  }
  fromValue(value_0) {
    return {
      patientCommit: _descriptor_0.fromValue(value_0),
      drugHash: _descriptor_0.fromValue(value_0),
      validFrom: _descriptor_7.fromValue(value_0),
      validUntil: _descriptor_7.fromValue(value_0),
      refillsTotal: _descriptor_4.fromValue(value_0)
    }
  }
  toValue(value_0) {
    return _descriptor_0.toValue(value_0.patientCommit).concat(_descriptor_0.toValue(value_0.drugHash).concat(_descriptor_7.toValue(value_0.validFrom).concat(_descriptor_7.toValue(value_0.validUntil).concat(_descriptor_4.toValue(value_0.refillsTotal)))));
  }
}

const _descriptor_8 = new _PrescriptionCriteria_0();

class _MerkleTreePathEntry_0 {
  alignment() {
    return _descriptor_3.alignment().concat(_descriptor_1.alignment());
  }
  fromValue(value_0) {
    return {
      sibling: _descriptor_3.fromValue(value_0),
      goes_left: _descriptor_1.fromValue(value_0)
    }
  }
  toValue(value_0) {
    return _descriptor_3.toValue(value_0.sibling).concat(_descriptor_1.toValue(value_0.goes_left));
  }
}

const _descriptor_9 = new _MerkleTreePathEntry_0();

const _descriptor_10 = new __compactRuntime.CompactTypeVector(20, _descriptor_9);

class _MerkleTreePath_0 {
  alignment() {
    return _descriptor_0.alignment().concat(_descriptor_10.alignment());
  }
  fromValue(value_0) {
    return {
      leaf: _descriptor_0.fromValue(value_0),
      path: _descriptor_10.fromValue(value_0)
    }
  }
  toValue(value_0) {
    return _descriptor_0.toValue(value_0.leaf).concat(_descriptor_10.toValue(value_0.path));
  }
}

const _descriptor_11 = new _MerkleTreePath_0();

class _PrescriptionCredential_0 {
  alignment() {
    return _descriptor_8.alignment().concat(_descriptor_0.alignment().concat(_descriptor_0.alignment().concat(_descriptor_0.alignment().concat(_descriptor_11.alignment()))));
  }
  fromValue(value_0) {
    return {
      criteria: _descriptor_8.fromValue(value_0),
      prescriptionNonce: _descriptor_0.fromValue(value_0),
      patientSecret: _descriptor_0.fromValue(value_0),
      patientNonce: _descriptor_0.fromValue(value_0),
      prescriptionPath: _descriptor_11.fromValue(value_0)
    }
  }
  toValue(value_0) {
    return _descriptor_8.toValue(value_0.criteria).concat(_descriptor_0.toValue(value_0.prescriptionNonce).concat(_descriptor_0.toValue(value_0.patientSecret).concat(_descriptor_0.toValue(value_0.patientNonce).concat(_descriptor_11.toValue(value_0.prescriptionPath)))));
  }
}

const _descriptor_12 = new _PrescriptionCredential_0();

const _descriptor_13 = new __compactRuntime.CompactTypeVector(2, _descriptor_0);

const _descriptor_14 = new __compactRuntime.CompactTypeBytes(6);

class _LeafPreimage_0 {
  alignment() {
    return _descriptor_14.alignment().concat(_descriptor_0.alignment());
  }
  fromValue(value_0) {
    return {
      domain_sep: _descriptor_14.fromValue(value_0),
      data: _descriptor_0.fromValue(value_0)
    }
  }
  toValue(value_0) {
    return _descriptor_14.toValue(value_0.domain_sep).concat(_descriptor_0.toValue(value_0.data));
  }
}

const _descriptor_15 = new _LeafPreimage_0();

const _descriptor_16 = new __compactRuntime.CompactTypeVector(2, _descriptor_2);

class _Either_0 {
  alignment() {
    return _descriptor_1.alignment().concat(_descriptor_0.alignment().concat(_descriptor_0.alignment()));
  }
  fromValue(value_0) {
    return {
      is_left: _descriptor_1.fromValue(value_0),
      left: _descriptor_0.fromValue(value_0),
      right: _descriptor_0.fromValue(value_0)
    }
  }
  toValue(value_0) {
    return _descriptor_1.toValue(value_0.is_left).concat(_descriptor_0.toValue(value_0.left).concat(_descriptor_0.toValue(value_0.right)));
  }
}

const _descriptor_17 = new _Either_0();

const _descriptor_18 = new __compactRuntime.CompactTypeUnsignedInteger(340282366920938463463374607431768211455n, 16);

class _ContractAddress_0 {
  alignment() {
    return _descriptor_0.alignment();
  }
  fromValue(value_0) {
    return {
      bytes: _descriptor_0.fromValue(value_0)
    }
  }
  toValue(value_0) {
    return _descriptor_0.toValue(value_0.bytes);
  }
}

const _descriptor_19 = new _ContractAddress_0();

export class Contract {
  witnesses;
  constructor(...args_0) {
    if (args_0.length !== 1) {
      throw new __compactRuntime.CompactError(`Contract constructor: expected 1 argument, received ${args_0.length}`);
    }
    const witnesses_0 = args_0[0];
    if (typeof(witnesses_0) !== 'object') {
      throw new __compactRuntime.CompactError('first (witnesses) argument to Contract constructor is not an object');
    }
    if (typeof(witnesses_0.doctorSecretKey) !== 'function') {
      throw new __compactRuntime.CompactError('first (witnesses) argument to Contract constructor does not contain a function-valued field named doctorSecretKey');
    }
    if (typeof(witnesses_0.prescriptionCredential) !== 'function') {
      throw new __compactRuntime.CompactError('first (witnesses) argument to Contract constructor does not contain a function-valued field named prescriptionCredential');
    }
    this.witnesses = witnesses_0;
    this.circuits = {
      issuePrescription: (...args_1) => {
        if (args_1.length !== 6) {
          throw new __compactRuntime.CompactError(`issuePrescription: expected 6 arguments (as invoked from Typescript), received ${args_1.length}`);
        }
        const contextOrig_0 = args_1[0];
        const patientCommit_0 = args_1[1];
        const validFrom_0 = args_1[2];
        const validUntil_0 = args_1[3];
        const encryptedDetails_0 = args_1[4];
        const prescriptionNonce_0 = args_1[5];
        if (!(typeof(contextOrig_0) === 'object' && contextOrig_0.currentQueryContext != undefined)) {
          __compactRuntime.typeError('issuePrescription',
                                     'argument 1 (as invoked from Typescript)',
                                     'MedProof.compact line 104 char 1',
                                     'CircuitContext',
                                     contextOrig_0)
        }
        if (!(patientCommit_0.buffer instanceof ArrayBuffer && patientCommit_0.BYTES_PER_ELEMENT === 1 && patientCommit_0.length === 32)) {
          __compactRuntime.typeError('issuePrescription',
                                     'argument 1 (argument 2 as invoked from Typescript)',
                                     'MedProof.compact line 104 char 1',
                                     'Bytes<32>',
                                     patientCommit_0)
        }
        if (!(typeof(validFrom_0) === 'bigint' && validFrom_0 >= 0n && validFrom_0 <= 18446744073709551615n)) {
          __compactRuntime.typeError('issuePrescription',
                                     'argument 2 (argument 3 as invoked from Typescript)',
                                     'MedProof.compact line 104 char 1',
                                     'Uint<0..18446744073709551616>',
                                     validFrom_0)
        }
        if (!(typeof(validUntil_0) === 'bigint' && validUntil_0 >= 0n && validUntil_0 <= 18446744073709551615n)) {
          __compactRuntime.typeError('issuePrescription',
                                     'argument 3 (argument 4 as invoked from Typescript)',
                                     'MedProof.compact line 104 char 1',
                                     'Uint<0..18446744073709551616>',
                                     validUntil_0)
        }
        if (!(encryptedDetails_0.buffer instanceof ArrayBuffer && encryptedDetails_0.BYTES_PER_ELEMENT === 1 && encryptedDetails_0.length === 256)) {
          __compactRuntime.typeError('issuePrescription',
                                     'argument 4 (argument 5 as invoked from Typescript)',
                                     'MedProof.compact line 104 char 1',
                                     'Bytes<256>',
                                     encryptedDetails_0)
        }
        if (!(prescriptionNonce_0.buffer instanceof ArrayBuffer && prescriptionNonce_0.BYTES_PER_ELEMENT === 1 && prescriptionNonce_0.length === 32)) {
          __compactRuntime.typeError('issuePrescription',
                                     'argument 5 (argument 6 as invoked from Typescript)',
                                     'MedProof.compact line 104 char 1',
                                     'Bytes<32>',
                                     prescriptionNonce_0)
        }
        const context = { ...contextOrig_0, gasCost: __compactRuntime.emptyRunningCost() };
        const partialProofData = {
          input: {
            value: _descriptor_0.toValue(patientCommit_0).concat(_descriptor_7.toValue(validFrom_0).concat(_descriptor_7.toValue(validUntil_0).concat(_descriptor_6.toValue(encryptedDetails_0).concat(_descriptor_0.toValue(prescriptionNonce_0))))),
            alignment: _descriptor_0.alignment().concat(_descriptor_7.alignment().concat(_descriptor_7.alignment().concat(_descriptor_6.alignment().concat(_descriptor_0.alignment()))))
          },
          output: undefined,
          publicTranscript: [],
          privateTranscriptOutputs: []
        };
        const result_0 = this._issuePrescription_0(context,
                                                   partialProofData,
                                                   patientCommit_0,
                                                   validFrom_0,
                                                   validUntil_0,
                                                   encryptedDetails_0,
                                                   prescriptionNonce_0);
        partialProofData.output = { value: _descriptor_0.toValue(result_0), alignment: _descriptor_0.alignment() };
        return { result: result_0, context: context, proofData: partialProofData, gasCost: context.gasCost };
      },
      proveValidPrescription: (...args_1) => {
        if (args_1.length !== 2) {
          throw new __compactRuntime.CompactError(`proveValidPrescription: expected 2 arguments (as invoked from Typescript), received ${args_1.length}`);
        }
        const contextOrig_0 = args_1[0];
        const requestedDrugHash_0 = args_1[1];
        if (!(typeof(contextOrig_0) === 'object' && contextOrig_0.currentQueryContext != undefined)) {
          __compactRuntime.typeError('proveValidPrescription',
                                     'argument 1 (as invoked from Typescript)',
                                     'MedProof.compact line 132 char 1',
                                     'CircuitContext',
                                     contextOrig_0)
        }
        if (!(requestedDrugHash_0.buffer instanceof ArrayBuffer && requestedDrugHash_0.BYTES_PER_ELEMENT === 1 && requestedDrugHash_0.length === 32)) {
          __compactRuntime.typeError('proveValidPrescription',
                                     'argument 1 (argument 2 as invoked from Typescript)',
                                     'MedProof.compact line 132 char 1',
                                     'Bytes<32>',
                                     requestedDrugHash_0)
        }
        const context = { ...contextOrig_0, gasCost: __compactRuntime.emptyRunningCost() };
        const partialProofData = {
          input: {
            value: _descriptor_0.toValue(requestedDrugHash_0),
            alignment: _descriptor_0.alignment()
          },
          output: undefined,
          publicTranscript: [],
          privateTranscriptOutputs: []
        };
        const result_0 = this._proveValidPrescription_0(context,
                                                        partialProofData,
                                                        requestedDrugHash_0);
        partialProofData.output = { value: _descriptor_5.toValue(result_0), alignment: _descriptor_5.alignment() };
        return { result: result_0, context: context, proofData: partialProofData, gasCost: context.gasCost };
      },
      dispense: (...args_1) => {
        if (args_1.length !== 2) {
          throw new __compactRuntime.CompactError(`dispense: expected 2 arguments (as invoked from Typescript), received ${args_1.length}`);
        }
        const contextOrig_0 = args_1[0];
        const requestedDrugHash_0 = args_1[1];
        if (!(typeof(contextOrig_0) === 'object' && contextOrig_0.currentQueryContext != undefined)) {
          __compactRuntime.typeError('dispense',
                                     'argument 1 (as invoked from Typescript)',
                                     'MedProof.compact line 159 char 1',
                                     'CircuitContext',
                                     contextOrig_0)
        }
        if (!(requestedDrugHash_0.buffer instanceof ArrayBuffer && requestedDrugHash_0.BYTES_PER_ELEMENT === 1 && requestedDrugHash_0.length === 32)) {
          __compactRuntime.typeError('dispense',
                                     'argument 1 (argument 2 as invoked from Typescript)',
                                     'MedProof.compact line 159 char 1',
                                     'Bytes<32>',
                                     requestedDrugHash_0)
        }
        const context = { ...contextOrig_0, gasCost: __compactRuntime.emptyRunningCost() };
        const partialProofData = {
          input: {
            value: _descriptor_0.toValue(requestedDrugHash_0),
            alignment: _descriptor_0.alignment()
          },
          output: undefined,
          publicTranscript: [],
          privateTranscriptOutputs: []
        };
        const result_0 = this._dispense_0(context,
                                          partialProofData,
                                          requestedDrugHash_0);
        partialProofData.output = { value: _descriptor_4.toValue(result_0), alignment: _descriptor_4.alignment() };
        return { result: result_0, context: context, proofData: partialProofData, gasCost: context.gasCost };
      }
    };
    this.impureCircuits = {
      issuePrescription: this.circuits.issuePrescription,
      proveValidPrescription: this.circuits.proveValidPrescription,
      dispense: this.circuits.dispense
    };
    this.provableCircuits = {
      issuePrescription: this.circuits.issuePrescription,
      proveValidPrescription: this.circuits.proveValidPrescription,
      dispense: this.circuits.dispense
    };
  }
  initialState(...args_0) {
    if (args_0.length !== 3) {
      throw new __compactRuntime.CompactError(`Contract state constructor: expected 3 arguments (as invoked from Typescript), received ${args_0.length}`);
    }
    const constructorContext_0 = args_0[0];
    const doctorSecret_0 = args_0[1];
    const drugHash_0 = args_0[2];
    if (typeof(constructorContext_0) !== 'object') {
      throw new __compactRuntime.CompactError(`Contract state constructor: expected 'constructorContext' in argument 1 (as invoked from Typescript) to be an object`);
    }
    if (!('initialPrivateState' in constructorContext_0)) {
      throw new __compactRuntime.CompactError(`Contract state constructor: expected 'initialPrivateState' in argument 1 (as invoked from Typescript)`);
    }
    if (!('initialZswapLocalState' in constructorContext_0)) {
      throw new __compactRuntime.CompactError(`Contract state constructor: expected 'initialZswapLocalState' in argument 1 (as invoked from Typescript)`);
    }
    if (typeof(constructorContext_0.initialZswapLocalState) !== 'object') {
      throw new __compactRuntime.CompactError(`Contract state constructor: expected 'initialZswapLocalState' in argument 1 (as invoked from Typescript) to be an object`);
    }
    if (!(doctorSecret_0.buffer instanceof ArrayBuffer && doctorSecret_0.BYTES_PER_ELEMENT === 1 && doctorSecret_0.length === 32)) {
      __compactRuntime.typeError('Contract state constructor',
                                 'argument 1 (argument 2 as invoked from Typescript)',
                                 'MedProof.compact line 55 char 1',
                                 'Bytes<32>',
                                 doctorSecret_0)
    }
    if (!(drugHash_0.buffer instanceof ArrayBuffer && drugHash_0.BYTES_PER_ELEMENT === 1 && drugHash_0.length === 32)) {
      __compactRuntime.typeError('Contract state constructor',
                                 'argument 2 (argument 3 as invoked from Typescript)',
                                 'MedProof.compact line 55 char 1',
                                 'Bytes<32>',
                                 drugHash_0)
    }
    const state_0 = new __compactRuntime.ContractState();
    let stateValue_0 = __compactRuntime.StateValue.newArray();
    stateValue_0 = stateValue_0.arrayPush(__compactRuntime.StateValue.newNull());
    stateValue_0 = stateValue_0.arrayPush(__compactRuntime.StateValue.newNull());
    stateValue_0 = stateValue_0.arrayPush(__compactRuntime.StateValue.newNull());
    stateValue_0 = stateValue_0.arrayPush(__compactRuntime.StateValue.newNull());
    stateValue_0 = stateValue_0.arrayPush(__compactRuntime.StateValue.newNull());
    state_0.data = new __compactRuntime.ChargedState(stateValue_0);
    state_0.setOperation('issuePrescription', new __compactRuntime.ContractOperation());
    state_0.setOperation('proveValidPrescription', new __compactRuntime.ContractOperation());
    state_0.setOperation('dispense', new __compactRuntime.ContractOperation());
    const context = __compactRuntime.createCircuitContext(__compactRuntime.dummyContractAddress(), constructorContext_0.initialZswapLocalState.coinPublicKey, state_0.data, constructorContext_0.initialPrivateState);
    const partialProofData = {
      input: { value: [], alignment: [] },
      output: undefined,
      publicTranscript: [],
      privateTranscriptOutputs: []
    };
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_4.toValue(0n),
                                                                                              alignment: _descriptor_4.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(new Uint8Array(32)),
                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_4.toValue(1n),
                                                                                              alignment: _descriptor_4.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(new Uint8Array(32)),
                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_4.toValue(2n),
                                                                                              alignment: _descriptor_4.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newArray()
                                                          .arrayPush(__compactRuntime.StateValue.newBoundedMerkleTree(
                                                                       new __compactRuntime.StateBoundedMerkleTree(20)
                                                                     )).arrayPush(__compactRuntime.StateValue.newCell({ value: _descriptor_7.toValue(0n),
                                                                                                                        alignment: _descriptor_7.alignment() })).arrayPush(__compactRuntime.StateValue.newMap(
                                                                                                                                                                             new __compactRuntime.StateMap()
                                                                                                                                                                           ))
                                                          .encode() } },
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_4.toValue(2n),
                                                                  alignment: _descriptor_4.alignment() } }] } },
                                       { dup: { n: 2 } },
                                       { idx: { cached: false,
                                                pushPath: false,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_4.toValue(0n),
                                                                  alignment: _descriptor_4.alignment() } }] } },
                                       'root',
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newNull().encode() } },
                                       { ins: { cached: true, n: 2 } },
                                       { ins: { cached: false, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_4.toValue(3n),
                                                                                              alignment: _descriptor_4.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newMap(
                                                          new __compactRuntime.StateMap()
                                                        ).encode() } },
                                       { ins: { cached: false, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_4.toValue(4n),
                                                                                              alignment: _descriptor_4.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newMap(
                                                          new __compactRuntime.StateMap()
                                                        ).encode() } },
                                       { ins: { cached: false, n: 1 } }]);
    const tmp_0 = this._doctorKey_0(doctorSecret_0);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_4.toValue(0n),
                                                                                              alignment: _descriptor_4.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(tmp_0),
                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_4.toValue(1n),
                                                                                              alignment: _descriptor_4.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(drugHash_0),
                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } }]);
    state_0.data = new __compactRuntime.ChargedState(context.currentQueryContext.state.state);
    return {
      currentContractState: state_0,
      currentPrivateState: context.currentPrivateState,
      currentZswapLocalState: context.currentZswapLocalState
    }
  }
  _merkleTreePathRoot_0(path_0) {
    return { field:
               this._folder_0((...args_0) =>
                                this._merkleTreePathEntryRoot_0(...args_0),
                              this._degradeToTransient_0(this._persistentHash_1({ domain_sep:
                                                                                    new Uint8Array([109, 100, 110, 58, 108, 104]),
                                                                                  data:
                                                                                    path_0.leaf })),
                              path_0.path) };
  }
  _merkleTreePathEntryRoot_0(recursiveDigest_0, entry_0) {
    const left_0 = entry_0.goes_left ? recursiveDigest_0 : entry_0.sibling.field;
    const right_0 = entry_0.goes_left ?
                    entry_0.sibling.field :
                    recursiveDigest_0;
    return this._transientHash_0([left_0, right_0]);
  }
  _blockTimeLt_0(context, partialProofData, time_0) {
    return _descriptor_1.fromValue(__compactRuntime.queryLedgerState(context,
                                                                     partialProofData,
                                                                     [
                                                                      { dup: { n: 2 } },
                                                                      { idx: { cached: true,
                                                                               pushPath: false,
                                                                               path: [
                                                                                      { tag: 'value',
                                                                                        value: { value: _descriptor_4.toValue(2n),
                                                                                                 alignment: _descriptor_4.alignment() } }] } },
                                                                      { push: { storage: false,
                                                                                value: __compactRuntime.StateValue.newCell({ value: _descriptor_7.toValue(time_0),
                                                                                                                             alignment: _descriptor_7.alignment() }).encode() } },
                                                                      'lt',
                                                                      { popeq: { cached: true,
                                                                                 result: undefined } }]).value);
  }
  _blockTimeGte_0(context, partialProofData, time_0) {
    return !this._blockTimeLt_0(context, partialProofData, time_0);
  }
  _blockTimeGt_0(context, partialProofData, time_0) {
    return _descriptor_1.fromValue(__compactRuntime.queryLedgerState(context,
                                                                     partialProofData,
                                                                     [
                                                                      { push: { storage: false,
                                                                                value: __compactRuntime.StateValue.newCell({ value: _descriptor_7.toValue(time_0),
                                                                                                                             alignment: _descriptor_7.alignment() }).encode() } },
                                                                      { dup: { n: 3 } },
                                                                      { idx: { cached: true,
                                                                               pushPath: false,
                                                                               path: [
                                                                                      { tag: 'value',
                                                                                        value: { value: _descriptor_4.toValue(2n),
                                                                                                 alignment: _descriptor_4.alignment() } }] } },
                                                                      'lt',
                                                                      { popeq: { cached: true,
                                                                                 result: undefined } }]).value);
  }
  _blockTimeLte_0(context, partialProofData, time_0) {
    return !this._blockTimeGt_0(context, partialProofData, time_0);
  }
  _transientHash_0(value_0) {
    const result_0 = __compactRuntime.transientHash(_descriptor_16, value_0);
    return result_0;
  }
  _persistentHash_0(value_0) {
    const result_0 = __compactRuntime.persistentHash(_descriptor_13, value_0);
    return result_0;
  }
  _persistentHash_1(value_0) {
    const result_0 = __compactRuntime.persistentHash(_descriptor_15, value_0);
    return result_0;
  }
  _persistentCommit_0(value_0, rand_0) {
    const result_0 = __compactRuntime.persistentCommit(_descriptor_8,
                                                       value_0,
                                                       rand_0);
    return result_0;
  }
  _persistentCommit_1(value_0, rand_0) {
    const result_0 = __compactRuntime.persistentCommit(_descriptor_13,
                                                       value_0,
                                                       rand_0);
    return result_0;
  }
  _degradeToTransient_0(x_0) {
    const result_0 = __compactRuntime.degradeToTransient(x_0);
    return result_0;
  }
  _doctorSecretKey_0(context, partialProofData) {
    const witnessContext_0 = __compactRuntime.createWitnessContext(ledger(context.currentQueryContext.state), context.currentPrivateState, context.currentQueryContext.address);
    const [nextPrivateState_0, result_0] = this.witnesses.doctorSecretKey(witnessContext_0);
    context.currentPrivateState = nextPrivateState_0;
    if (!(result_0.buffer instanceof ArrayBuffer && result_0.BYTES_PER_ELEMENT === 1 && result_0.length === 32)) {
      __compactRuntime.typeError('doctorSecretKey',
                                 'return value',
                                 'MedProof.compact line 61 char 1',
                                 'Bytes<32>',
                                 result_0)
    }
    partialProofData.privateTranscriptOutputs.push({
      value: _descriptor_0.toValue(result_0),
      alignment: _descriptor_0.alignment()
    });
    return result_0;
  }
  _prescriptionCredential_0(context, partialProofData) {
    const witnessContext_0 = __compactRuntime.createWitnessContext(ledger(context.currentQueryContext.state), context.currentPrivateState, context.currentQueryContext.address);
    const [nextPrivateState_0, result_0] = this.witnesses.prescriptionCredential(witnessContext_0);
    context.currentPrivateState = nextPrivateState_0;
    if (!(typeof(result_0) === 'object' && typeof(result_0.criteria) === 'object' && result_0.criteria.patientCommit.buffer instanceof ArrayBuffer && result_0.criteria.patientCommit.BYTES_PER_ELEMENT === 1 && result_0.criteria.patientCommit.length === 32 && result_0.criteria.drugHash.buffer instanceof ArrayBuffer && result_0.criteria.drugHash.BYTES_PER_ELEMENT === 1 && result_0.criteria.drugHash.length === 32 && typeof(result_0.criteria.validFrom) === 'bigint' && result_0.criteria.validFrom >= 0n && result_0.criteria.validFrom <= 18446744073709551615n && typeof(result_0.criteria.validUntil) === 'bigint' && result_0.criteria.validUntil >= 0n && result_0.criteria.validUntil <= 18446744073709551615n && typeof(result_0.criteria.refillsTotal) === 'bigint' && result_0.criteria.refillsTotal >= 0n && result_0.criteria.refillsTotal <= 255n && result_0.prescriptionNonce.buffer instanceof ArrayBuffer && result_0.prescriptionNonce.BYTES_PER_ELEMENT === 1 && result_0.prescriptionNonce.length === 32 && result_0.patientSecret.buffer instanceof ArrayBuffer && result_0.patientSecret.BYTES_PER_ELEMENT === 1 && result_0.patientSecret.length === 32 && result_0.patientNonce.buffer instanceof ArrayBuffer && result_0.patientNonce.BYTES_PER_ELEMENT === 1 && result_0.patientNonce.length === 32 && typeof(result_0.prescriptionPath) === 'object' && result_0.prescriptionPath.leaf.buffer instanceof ArrayBuffer && result_0.prescriptionPath.leaf.BYTES_PER_ELEMENT === 1 && result_0.prescriptionPath.leaf.length === 32 && Array.isArray(result_0.prescriptionPath.path) && result_0.prescriptionPath.path.length === 20 && result_0.prescriptionPath.path.every((t) => typeof(t) === 'object' && typeof(t.sibling) === 'object' && typeof(t.sibling.field) === 'bigint' && t.sibling.field >= 0 && t.sibling.field <= __compactRuntime.MAX_FIELD && typeof(t.goes_left) === 'boolean'))) {
      __compactRuntime.typeError('prescriptionCredential',
                                 'return value',
                                 'MedProof.compact line 63 char 1',
                                 'struct PrescriptionCredential<criteria: struct PrescriptionCriteria<patientCommit: Bytes<32>, drugHash: Bytes<32>, validFrom: Uint<0..18446744073709551616>, validUntil: Uint<0..18446744073709551616>, refillsTotal: Uint<0..256>>, prescriptionNonce: Bytes<32>, patientSecret: Bytes<32>, patientNonce: Bytes<32>, prescriptionPath: struct MerkleTreePath<leaf: Bytes<32>, path: Vector<20, struct MerkleTreePathEntry<sibling: struct MerkleTreeDigest<field: Field>, goes_left: Boolean>>>>',
                                 result_0)
    }
    partialProofData.privateTranscriptOutputs.push({
      value: _descriptor_12.toValue(result_0),
      alignment: _descriptor_12.alignment()
    });
    return result_0;
  }
  _doctorKey_0(secret_0) {
    return this._persistentHash_0([new Uint8Array([109, 101, 100, 112, 114, 111, 111, 102, 58, 100, 111, 99, 116, 111, 114, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]),
                                   secret_0]);
  }
  _patientCommitment_0(secret_0, nonce_0) {
    return this._persistentCommit_1([new Uint8Array([109, 101, 100, 112, 114, 111, 111, 102, 58, 112, 97, 116, 105, 101, 110, 116, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]),
                                     secret_0],
                                    nonce_0);
  }
  _prescriptionId_0(criteria_0, nonce_0) {
    return this._persistentCommit_0(criteria_0, nonce_0);
  }
  _dispenseNullifier_0(id_0, patientSecret_0) {
    return this._persistentCommit_1([new Uint8Array([109, 101, 100, 112, 114, 111, 111, 102, 58, 100, 105, 115, 112, 101, 110, 115, 101, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]),
                                     id_0],
                                    patientSecret_0);
  }
  _credentialMatches_0(context, partialProofData, id_0, credential_0) {
    const correctId_0 = this._equal_0(this._prescriptionId_0(credential_0.criteria,
                                                             credential_0.prescriptionNonce),
                                      id_0);
    const correctPatient_0 = this._equal_1(this._patientCommitment_0(credential_0.patientSecret,
                                                                     credential_0.patientNonce),
                                           credential_0.criteria.patientCommit);
    const correctDrug_0 = this._equal_2(credential_0.criteria.drugHash,
                                        _descriptor_0.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                                  partialProofData,
                                                                                                  [
                                                                                                   { dup: { n: 0 } },
                                                                                                   { idx: { cached: false,
                                                                                                            pushPath: false,
                                                                                                            path: [
                                                                                                                   { tag: 'value',
                                                                                                                     value: { value: _descriptor_4.toValue(1n),
                                                                                                                              alignment: _descriptor_4.alignment() } }] } },
                                                                                                   { popeq: { cached: false,
                                                                                                              result: undefined } }]).value));
    const demoRefillPolicy_0 = this._equal_3(credential_0.criteria.refillsTotal,
                                             1n);
    return correctId_0 && correctPatient_0 && correctDrug_0
           &&
           demoRefillPolicy_0;
  }
  _currentlyValid_0(context, partialProofData, criteria_0) {
    return this._blockTimeGte_0(context, partialProofData, criteria_0.validFrom)
           &&
           this._blockTimeLte_0(context, partialProofData, criteria_0.validUntil);
  }
  _authorizedDoctor_0(context, partialProofData) {
    return this._equal_4(this._doctorKey_0(this._doctorSecretKey_0(context,
                                                                   partialProofData)),
                         _descriptor_0.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                   partialProofData,
                                                                                   [
                                                                                    { dup: { n: 0 } },
                                                                                    { idx: { cached: false,
                                                                                             pushPath: false,
                                                                                             path: [
                                                                                                    { tag: 'value',
                                                                                                      value: { value: _descriptor_4.toValue(0n),
                                                                                                               alignment: _descriptor_4.alignment() } }] } },
                                                                                    { popeq: { cached: false,
                                                                                               result: undefined } }]).value));
  }
  _issuePrescription_0(context,
                       partialProofData,
                       patientCommit_0,
                       validFrom_0,
                       validUntil_0,
                       encryptedDetails_0,
                       prescriptionNonce_0)
  {
    __compactRuntime.assert(this._authorizedDoctor_0(context, partialProofData),
                            'issuePrescription: not authorized doctor');
    __compactRuntime.assert(validUntil_0 > validFrom_0,
                            'issuePrescription: bad validity window');
    const criteria_0 = { patientCommit: patientCommit_0,
                         drugHash:
                           _descriptor_0.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                     partialProofData,
                                                                                     [
                                                                                      { dup: { n: 0 } },
                                                                                      { idx: { cached: false,
                                                                                               pushPath: false,
                                                                                               path: [
                                                                                                      { tag: 'value',
                                                                                                        value: { value: _descriptor_4.toValue(1n),
                                                                                                                 alignment: _descriptor_4.alignment() } }] } },
                                                                                      { popeq: { cached: false,
                                                                                                 result: undefined } }]).value),
                         validFrom: validFrom_0,
                         validUntil: validUntil_0,
                         refillsTotal: 1n };
    const id_0 = this._prescriptionId_0(criteria_0, prescriptionNonce_0);
    __compactRuntime.assert(!_descriptor_1.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                       partialProofData,
                                                                                       [
                                                                                        { dup: { n: 0 } },
                                                                                        { idx: { cached: false,
                                                                                                 pushPath: false,
                                                                                                 path: [
                                                                                                        { tag: 'value',
                                                                                                          value: { value: _descriptor_4.toValue(3n),
                                                                                                                   alignment: _descriptor_4.alignment() } }] } },
                                                                                        { push: { storage: false,
                                                                                                  value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(id_0),
                                                                                                                                               alignment: _descriptor_0.alignment() }).encode() } },
                                                                                        'member',
                                                                                        { popeq: { cached: true,
                                                                                                   result: undefined } }]).value),
                            'issuePrescription: duplicate id');
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_4.toValue(2n),
                                                                  alignment: _descriptor_4.alignment() } }] } },
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_4.toValue(0n),
                                                                  alignment: _descriptor_4.alignment() } }] } },
                                       { dup: { n: 2 } },
                                       { idx: { cached: false,
                                                pushPath: false,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_4.toValue(1n),
                                                                  alignment: _descriptor_4.alignment() } }] } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell(__compactRuntime.leafHash(
                                                                                              { value: _descriptor_0.toValue(id_0),
                                                                                                alignment: _descriptor_0.alignment() }
                                                                                            )).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } },
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_4.toValue(1n),
                                                                  alignment: _descriptor_4.alignment() } }] } },
                                       { addi: { immediate: 1 } },
                                       { ins: { cached: true, n: 1 } },
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_4.toValue(2n),
                                                                  alignment: _descriptor_4.alignment() } }] } },
                                       { dup: { n: 2 } },
                                       { idx: { cached: false,
                                                pushPath: false,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_4.toValue(0n),
                                                                  alignment: _descriptor_4.alignment() } }] } },
                                       'root',
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newNull().encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 2 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_4.toValue(3n),
                                                                  alignment: _descriptor_4.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(id_0),
                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_6.toValue(encryptedDetails_0),
                                                                                              alignment: _descriptor_6.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    return id_0;
  }
  _proveValidPrescription_0(context, partialProofData, requestedDrugHash_0) {
    const publicRequestedDrugHash_0 = requestedDrugHash_0;
    const credential_0 = this._prescriptionCredential_0(context,
                                                        partialProofData);
    const id_0 = this._prescriptionId_0(credential_0.criteria,
                                        credential_0.prescriptionNonce);
    const root_0 = this._merkleTreePathRoot_0(credential_0.prescriptionPath);
    const issued_0 = _descriptor_1.fromValue(__compactRuntime.queryLedgerState(context,
                                                                               partialProofData,
                                                                               [
                                                                                { dup: { n: 0 } },
                                                                                { idx: { cached: false,
                                                                                         pushPath: false,
                                                                                         path: [
                                                                                                { tag: 'value',
                                                                                                  value: { value: _descriptor_4.toValue(2n),
                                                                                                           alignment: _descriptor_4.alignment() } }] } },
                                                                                { idx: { cached: false,
                                                                                         pushPath: false,
                                                                                         path: [
                                                                                                { tag: 'value',
                                                                                                  value: { value: _descriptor_4.toValue(2n),
                                                                                                           alignment: _descriptor_4.alignment() } }] } },
                                                                                { push: { storage: false,
                                                                                          value: __compactRuntime.StateValue.newCell({ value: _descriptor_3.toValue(root_0),
                                                                                                                                       alignment: _descriptor_3.alignment() }).encode() } },
                                                                                'member',
                                                                                { popeq: { cached: true,
                                                                                           result: undefined } }]).value);
    const correctLeaf_0 = this._equal_5(credential_0.prescriptionPath.leaf, id_0);
    const nullifier_0 = this._dispenseNullifier_0(id_0,
                                                  credential_0.patientSecret);
    const available_0 = !_descriptor_1.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                   partialProofData,
                                                                                   [
                                                                                    { dup: { n: 0 } },
                                                                                    { idx: { cached: false,
                                                                                             pushPath: false,
                                                                                             path: [
                                                                                                    { tag: 'value',
                                                                                                      value: { value: _descriptor_4.toValue(4n),
                                                                                                               alignment: _descriptor_4.alignment() } }] } },
                                                                                    { push: { storage: false,
                                                                                              value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(nullifier_0),
                                                                                                                                           alignment: _descriptor_0.alignment() }).encode() } },
                                                                                    'member',
                                                                                    { popeq: { cached: true,
                                                                                               result: undefined } }]).value);
    const matchesCredential_0 = this._credentialMatches_0(context,
                                                          partialProofData,
                                                          id_0,
                                                          credential_0);
    const matchesDrug_0 = this._equal_6(publicRequestedDrugHash_0,
                                        _descriptor_0.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                                  partialProofData,
                                                                                                  [
                                                                                                   { dup: { n: 0 } },
                                                                                                   { idx: { cached: false,
                                                                                                            pushPath: false,
                                                                                                            path: [
                                                                                                                   { tag: 'value',
                                                                                                                     value: { value: _descriptor_4.toValue(1n),
                                                                                                                              alignment: _descriptor_4.alignment() } }] } },
                                                                                                   { popeq: { cached: false,
                                                                                                              result: undefined } }]).value));
    const inWindow_0 = this._currentlyValid_0(context,
                                              partialProofData,
                                              credential_0.criteria);
    const valid_0 = issued_0 && correctLeaf_0 && matchesCredential_0
                    &&
                    matchesDrug_0
                    &&
                    inWindow_0
                    &&
                    available_0;
    if (valid_0) {
      return { valid: true,
               drugHash:
                 _descriptor_0.fromValue(__compactRuntime.queryLedgerState(context,
                                                                           partialProofData,
                                                                           [
                                                                            { dup: { n: 0 } },
                                                                            { idx: { cached: false,
                                                                                     pushPath: false,
                                                                                     path: [
                                                                                            { tag: 'value',
                                                                                              value: { value: _descriptor_4.toValue(1n),
                                                                                                       alignment: _descriptor_4.alignment() } }] } },
                                                                            { popeq: { cached: false,
                                                                                       result: undefined } }]).value),
               refillsRemaining: 1n };
    } else {
      return { valid: false,
               drugHash: publicRequestedDrugHash_0,
               refillsRemaining: 0n };
    }
  }
  _dispense_0(context, partialProofData, requestedDrugHash_0) {
    let publicRequestedDrugHash_0,
        credential_0,
        id_0,
        root_0,
        issued_0,
        correctLeaf_0,
        nullifier_0;
    return publicRequestedDrugHash_0 = requestedDrugHash_0,
           (credential_0 = this._prescriptionCredential_0(context,
                                                          partialProofData),
            (id_0 = this._prescriptionId_0(credential_0.criteria,
                                           credential_0.prescriptionNonce),
             (root_0 = this._merkleTreePathRoot_0(credential_0.prescriptionPath),
              (issued_0 = _descriptor_1.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                    partialProofData,
                                                                                    [
                                                                                     { dup: { n: 0 } },
                                                                                     { idx: { cached: false,
                                                                                              pushPath: false,
                                                                                              path: [
                                                                                                     { tag: 'value',
                                                                                                       value: { value: _descriptor_4.toValue(2n),
                                                                                                                alignment: _descriptor_4.alignment() } }] } },
                                                                                     { idx: { cached: false,
                                                                                              pushPath: false,
                                                                                              path: [
                                                                                                     { tag: 'value',
                                                                                                       value: { value: _descriptor_4.toValue(2n),
                                                                                                                alignment: _descriptor_4.alignment() } }] } },
                                                                                     { push: { storage: false,
                                                                                               value: __compactRuntime.StateValue.newCell({ value: _descriptor_3.toValue(root_0),
                                                                                                                                            alignment: _descriptor_3.alignment() }).encode() } },
                                                                                     'member',
                                                                                     { popeq: { cached: true,
                                                                                                result: undefined } }]).value),
               (correctLeaf_0 = this._equal_7(credential_0.prescriptionPath.leaf,
                                              id_0),
                (__compactRuntime.assert(issued_0 && correctLeaf_0,
                                         'dispense: unknown prescription'),
                 __compactRuntime.assert(this._credentialMatches_0(context,
                                                                   partialProofData,
                                                                   id_0,
                                                                   credential_0),
                                         'dispense: invalid credential'),
                 __compactRuntime.assert(this._equal_8(publicRequestedDrugHash_0,
                                                       _descriptor_0.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                                                 partialProofData,
                                                                                                                 [
                                                                                                                  { dup: { n: 0 } },
                                                                                                                  { idx: { cached: false,
                                                                                                                           pushPath: false,
                                                                                                                           path: [
                                                                                                                                  { tag: 'value',
                                                                                                                                    value: { value: _descriptor_4.toValue(1n),
                                                                                                                                             alignment: _descriptor_4.alignment() } }] } },
                                                                                                                  { popeq: { cached: false,
                                                                                                                             result: undefined } }]).value)),
                                         'dispense: wrong medicine'),
                 __compactRuntime.assert(this._currentlyValid_0(context,
                                                                partialProofData,
                                                                credential_0.criteria),
                                         'dispense: outside valid window'),
                 (nullifier_0 = this._dispenseNullifier_0(id_0,
                                                          credential_0.patientSecret),
                  (__compactRuntime.assert(!_descriptor_1.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                                      partialProofData,
                                                                                                      [
                                                                                                       { dup: { n: 0 } },
                                                                                                       { idx: { cached: false,
                                                                                                                pushPath: false,
                                                                                                                path: [
                                                                                                                       { tag: 'value',
                                                                                                                         value: { value: _descriptor_4.toValue(4n),
                                                                                                                                  alignment: _descriptor_4.alignment() } }] } },
                                                                                                       { push: { storage: false,
                                                                                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(nullifier_0),
                                                                                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                                                                                       'member',
                                                                                                       { popeq: { cached: true,
                                                                                                                  result: undefined } }]).value),
                                           'dispense: already filled'),
                   __compactRuntime.queryLedgerState(context,
                                                     partialProofData,
                                                     [
                                                      { idx: { cached: false,
                                                               pushPath: true,
                                                               path: [
                                                                      { tag: 'value',
                                                                        value: { value: _descriptor_4.toValue(4n),
                                                                                 alignment: _descriptor_4.alignment() } }] } },
                                                      { push: { storage: false,
                                                                value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(nullifier_0),
                                                                                                             alignment: _descriptor_0.alignment() }).encode() } },
                                                      { push: { storage: true,
                                                                value: __compactRuntime.StateValue.newNull().encode() } },
                                                      { ins: { cached: false,
                                                               n: 1 } },
                                                      { ins: { cached: true,
                                                               n: 1 } }]),
                   0n))))))));
  }
  _folder_0(f, x, a0) {
    for (let i = 0; i < 20; i++) { x = f(x, a0[i]); }
    return x;
  }
  _equal_0(x0, y0) {
    if (!x0.every((x, i) => y0[i] === x)) { return false; }
    return true;
  }
  _equal_1(x0, y0) {
    if (!x0.every((x, i) => y0[i] === x)) { return false; }
    return true;
  }
  _equal_2(x0, y0) {
    if (!x0.every((x, i) => y0[i] === x)) { return false; }
    return true;
  }
  _equal_3(x0, y0) {
    if (x0 !== y0) { return false; }
    return true;
  }
  _equal_4(x0, y0) {
    if (!x0.every((x, i) => y0[i] === x)) { return false; }
    return true;
  }
  _equal_5(x0, y0) {
    if (!x0.every((x, i) => y0[i] === x)) { return false; }
    return true;
  }
  _equal_6(x0, y0) {
    if (!x0.every((x, i) => y0[i] === x)) { return false; }
    return true;
  }
  _equal_7(x0, y0) {
    if (!x0.every((x, i) => y0[i] === x)) { return false; }
    return true;
  }
  _equal_8(x0, y0) {
    if (!x0.every((x, i) => y0[i] === x)) { return false; }
    return true;
  }
}
export function ledger(stateOrChargedState) {
  const state = stateOrChargedState instanceof __compactRuntime.StateValue ? stateOrChargedState : stateOrChargedState.state;
  const chargedState = stateOrChargedState instanceof __compactRuntime.StateValue ? new __compactRuntime.ChargedState(stateOrChargedState) : stateOrChargedState;
  const context = {
    currentQueryContext: new __compactRuntime.QueryContext(chargedState, __compactRuntime.dummyContractAddress()),
    costModel: __compactRuntime.CostModel.initialCostModel()
  };
  const partialProofData = {
    input: { value: [], alignment: [] },
    output: undefined,
    publicTranscript: [],
    privateTranscriptOutputs: []
  };
  return {
    get doctorPk() {
      return _descriptor_0.fromValue(__compactRuntime.queryLedgerState(context,
                                                                       partialProofData,
                                                                       [
                                                                        { dup: { n: 0 } },
                                                                        { idx: { cached: false,
                                                                                 pushPath: false,
                                                                                 path: [
                                                                                        { tag: 'value',
                                                                                          value: { value: _descriptor_4.toValue(0n),
                                                                                                   alignment: _descriptor_4.alignment() } }] } },
                                                                        { popeq: { cached: false,
                                                                                   result: undefined } }]).value);
    },
    get supportedDrugHash() {
      return _descriptor_0.fromValue(__compactRuntime.queryLedgerState(context,
                                                                       partialProofData,
                                                                       [
                                                                        { dup: { n: 0 } },
                                                                        { idx: { cached: false,
                                                                                 pushPath: false,
                                                                                 path: [
                                                                                        { tag: 'value',
                                                                                          value: { value: _descriptor_4.toValue(1n),
                                                                                                   alignment: _descriptor_4.alignment() } }] } },
                                                                        { popeq: { cached: false,
                                                                                   result: undefined } }]).value);
    },
    issuedPrescriptions: {
      isFull(...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`isFull: expected 0 arguments, received ${args_0.length}`);
        }
        return _descriptor_1.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_4.toValue(2n),
                                                                                                     alignment: _descriptor_4.alignment() } }] } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_4.toValue(1n),
                                                                                                     alignment: _descriptor_4.alignment() } }] } },
                                                                          { push: { storage: false,
                                                                                    value: __compactRuntime.StateValue.newCell({ value: _descriptor_7.toValue(1048576n),
                                                                                                                                 alignment: _descriptor_7.alignment() }).encode() } },
                                                                          'lt',
                                                                          'neg',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      checkRoot(...args_0) {
        if (args_0.length !== 1) {
          throw new __compactRuntime.CompactError(`checkRoot: expected 1 argument, received ${args_0.length}`);
        }
        const rt_0 = args_0[0];
        if (!(typeof(rt_0) === 'object' && typeof(rt_0.field) === 'bigint' && rt_0.field >= 0 && rt_0.field <= __compactRuntime.MAX_FIELD)) {
          __compactRuntime.typeError('checkRoot',
                                     'argument 1',
                                     'MedProof.compact line 49 char 1',
                                     'struct MerkleTreeDigest<field: Field>',
                                     rt_0)
        }
        return _descriptor_1.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_4.toValue(2n),
                                                                                                     alignment: _descriptor_4.alignment() } }] } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_4.toValue(2n),
                                                                                                     alignment: _descriptor_4.alignment() } }] } },
                                                                          { push: { storage: false,
                                                                                    value: __compactRuntime.StateValue.newCell({ value: _descriptor_3.toValue(rt_0),
                                                                                                                                 alignment: _descriptor_3.alignment() }).encode() } },
                                                                          'member',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      root(...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`root: expected 0 arguments, received ${args_0.length}`);
        }
        const self_0 = state.asArray()[2];
        return ((result) => result             ? __compactRuntime.CompactTypeMerkleTreeDigest.fromValue(result)             : undefined)(self_0.asArray()[0].asBoundedMerkleTree().rehash().root()?.value);
      },
      firstFree(...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`first_free: expected 0 arguments, received ${args_0.length}`);
        }
        const self_0 = state.asArray()[2];
        return __compactRuntime.CompactTypeField.fromValue(self_0.asArray()[1].asCell().value);
      },
      pathForLeaf(...args_0) {
        if (args_0.length !== 2) {
          throw new __compactRuntime.CompactError(`path_for_leaf: expected 2 arguments, received ${args_0.length}`);
        }
        const index_0 = args_0[0];
        const leaf_0 = args_0[1];
        if (!(typeof(index_0) === 'bigint' && index_0 >= 0 && index_0 <= __compactRuntime.MAX_FIELD)) {
          __compactRuntime.typeError('path_for_leaf',
                                     'argument 1',
                                     'MedProof.compact line 49 char 1',
                                     'Field',
                                     index_0)
        }
        if (!(leaf_0.buffer instanceof ArrayBuffer && leaf_0.BYTES_PER_ELEMENT === 1 && leaf_0.length === 32)) {
          __compactRuntime.typeError('path_for_leaf',
                                     'argument 2',
                                     'MedProof.compact line 49 char 1',
                                     'Bytes<32>',
                                     leaf_0)
        }
        const self_0 = state.asArray()[2];
        return ((result) => result             ? new __compactRuntime.CompactTypeMerkleTreePath(20, _descriptor_0).fromValue(result)             : undefined)(  self_0.asArray()[0].asBoundedMerkleTree().rehash().pathForLeaf(    index_0,    {      value: _descriptor_0.toValue(leaf_0),      alignment: _descriptor_0.alignment()    }  )?.value);
      },
      findPathForLeaf(...args_0) {
        if (args_0.length !== 1) {
          throw new __compactRuntime.CompactError(`find_path_for_leaf: expected 1 argument, received ${args_0.length}`);
        }
        const leaf_0 = args_0[0];
        if (!(leaf_0.buffer instanceof ArrayBuffer && leaf_0.BYTES_PER_ELEMENT === 1 && leaf_0.length === 32)) {
          __compactRuntime.typeError('find_path_for_leaf',
                                     'argument 1',
                                     'MedProof.compact line 49 char 1',
                                     'Bytes<32>',
                                     leaf_0)
        }
        const self_0 = state.asArray()[2];
        return ((result) => result             ? new __compactRuntime.CompactTypeMerkleTreePath(20, _descriptor_0).fromValue(result)             : undefined)(  self_0.asArray()[0].asBoundedMerkleTree().rehash().findPathForLeaf(    {      value: _descriptor_0.toValue(leaf_0),      alignment: _descriptor_0.alignment()    }  )?.value);
      },
      history(...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`history: expected 0 arguments, received ${args_0.length}`);
        }
        const self_0 = state.asArray()[2];
        return self_0.asArray()[2].asMap().keys().map(  (elem) => __compactRuntime.CompactTypeMerkleTreeDigest.fromValue(elem.value))[Symbol.iterator]();
      }
    },
    encryptedPrescriptions: {
      isEmpty(...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`isEmpty: expected 0 arguments, received ${args_0.length}`);
        }
        return _descriptor_1.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_4.toValue(3n),
                                                                                                     alignment: _descriptor_4.alignment() } }] } },
                                                                          'size',
                                                                          { push: { storage: false,
                                                                                    value: __compactRuntime.StateValue.newCell({ value: _descriptor_7.toValue(0n),
                                                                                                                                 alignment: _descriptor_7.alignment() }).encode() } },
                                                                          'eq',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      size(...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`size: expected 0 arguments, received ${args_0.length}`);
        }
        return _descriptor_7.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_4.toValue(3n),
                                                                                                     alignment: _descriptor_4.alignment() } }] } },
                                                                          'size',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      member(...args_0) {
        if (args_0.length !== 1) {
          throw new __compactRuntime.CompactError(`member: expected 1 argument, received ${args_0.length}`);
        }
        const key_0 = args_0[0];
        if (!(key_0.buffer instanceof ArrayBuffer && key_0.BYTES_PER_ELEMENT === 1 && key_0.length === 32)) {
          __compactRuntime.typeError('member',
                                     'argument 1',
                                     'MedProof.compact line 51 char 1',
                                     'Bytes<32>',
                                     key_0)
        }
        return _descriptor_1.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_4.toValue(3n),
                                                                                                     alignment: _descriptor_4.alignment() } }] } },
                                                                          { push: { storage: false,
                                                                                    value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(key_0),
                                                                                                                                 alignment: _descriptor_0.alignment() }).encode() } },
                                                                          'member',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      lookup(...args_0) {
        if (args_0.length !== 1) {
          throw new __compactRuntime.CompactError(`lookup: expected 1 argument, received ${args_0.length}`);
        }
        const key_0 = args_0[0];
        if (!(key_0.buffer instanceof ArrayBuffer && key_0.BYTES_PER_ELEMENT === 1 && key_0.length === 32)) {
          __compactRuntime.typeError('lookup',
                                     'argument 1',
                                     'MedProof.compact line 51 char 1',
                                     'Bytes<32>',
                                     key_0)
        }
        return _descriptor_6.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_4.toValue(3n),
                                                                                                     alignment: _descriptor_4.alignment() } }] } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_0.toValue(key_0),
                                                                                                     alignment: _descriptor_0.alignment() } }] } },
                                                                          { popeq: { cached: false,
                                                                                     result: undefined } }]).value);
      },
      [Symbol.iterator](...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`iter: expected 0 arguments, received ${args_0.length}`);
        }
        const self_0 = state.asArray()[3];
        return self_0.asMap().keys().map(  (key) => {    const value = self_0.asMap().get(key).asCell();    return [      _descriptor_0.fromValue(key.value),      _descriptor_6.fromValue(value.value)    ];  })[Symbol.iterator]();
      }
    },
    usedDispenses: {
      isEmpty(...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`isEmpty: expected 0 arguments, received ${args_0.length}`);
        }
        return _descriptor_1.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_4.toValue(4n),
                                                                                                     alignment: _descriptor_4.alignment() } }] } },
                                                                          'size',
                                                                          { push: { storage: false,
                                                                                    value: __compactRuntime.StateValue.newCell({ value: _descriptor_7.toValue(0n),
                                                                                                                                 alignment: _descriptor_7.alignment() }).encode() } },
                                                                          'eq',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      size(...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`size: expected 0 arguments, received ${args_0.length}`);
        }
        return _descriptor_7.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_4.toValue(4n),
                                                                                                     alignment: _descriptor_4.alignment() } }] } },
                                                                          'size',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      member(...args_0) {
        if (args_0.length !== 1) {
          throw new __compactRuntime.CompactError(`member: expected 1 argument, received ${args_0.length}`);
        }
        const elem_0 = args_0[0];
        if (!(elem_0.buffer instanceof ArrayBuffer && elem_0.BYTES_PER_ELEMENT === 1 && elem_0.length === 32)) {
          __compactRuntime.typeError('member',
                                     'argument 1',
                                     'MedProof.compact line 53 char 1',
                                     'Bytes<32>',
                                     elem_0)
        }
        return _descriptor_1.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_4.toValue(4n),
                                                                                                     alignment: _descriptor_4.alignment() } }] } },
                                                                          { push: { storage: false,
                                                                                    value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(elem_0),
                                                                                                                                 alignment: _descriptor_0.alignment() }).encode() } },
                                                                          'member',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      [Symbol.iterator](...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`iter: expected 0 arguments, received ${args_0.length}`);
        }
        const self_0 = state.asArray()[4];
        return self_0.asMap().keys().map((elem) => _descriptor_0.fromValue(elem.value))[Symbol.iterator]();
      }
    }
  };
}
const _emptyContext = {
  currentQueryContext: new __compactRuntime.QueryContext(new __compactRuntime.ContractState().data, __compactRuntime.dummyContractAddress())
};
const _dummyContract = new Contract({
  doctorSecretKey: (...args) => undefined,
  prescriptionCredential: (...args) => undefined
});
export const pureCircuits = {};
export const contractReferenceLocations =
  { tag: 'publicLedgerArray', indices: { } };
//# sourceMappingURL=index.js.map

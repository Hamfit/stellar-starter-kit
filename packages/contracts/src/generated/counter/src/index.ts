import { Buffer } from "buffer";
import { Address } from "@stellar/stellar-sdk";
import {
  AssembledTransaction,
  Client as ContractClient,
  ClientOptions as ContractClientOptions,
  MethodOptions,
  Result,
  Spec as ContractSpec,
} from "@stellar/stellar-sdk/contract";
import type {
  u32,
  i32,
  u64,
  i64,
  u128,
  i128,
  u256,
  i256,
  Option,
  Timepoint,
  Duration,
} from "@stellar/stellar-sdk/contract";
export * from "@stellar/stellar-sdk";
export * as contract from "@stellar/stellar-sdk/contract";
export * as rpc from "@stellar/stellar-sdk/rpc";

if (typeof window !== "undefined") {
  //@ts-ignore Buffer exists
  window.Buffer = window.Buffer || Buffer;
}




export const CounterError = {
  1: {message:"AlreadyInitialized"},
  2: {message:"NotInitialized"},
  3: {message:"Underflow"},
  4: {message:"Overflow"}
}

export interface Client {
  /**
   * Construct and simulate a reset transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Reset the count to 0. Enforces owner authorization.
   */
  reset: (options?: MethodOptions) => Promise<AssembledTransaction<Result<u32>>>

  /**
   * Construct and simulate a decrement transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Decrement the count. Prevents underflow.
   */
  decrement: (options?: MethodOptions) => Promise<AssembledTransaction<Result<u32>>>

  /**
   * Construct and simulate a get_count transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Retrieve the current count.
   */
  get_count: (options?: MethodOptions) => Promise<AssembledTransaction<u32>>

  /**
   * Construct and simulate a get_owner transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Retrieve the owner address.
   */
  get_owner: (options?: MethodOptions) => Promise<AssembledTransaction<Option<string>>>

  /**
   * Construct and simulate a increment transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Increment the count. Prevents overflow.
   */
  increment: (options?: MethodOptions) => Promise<AssembledTransaction<Result<u32>>>

  /**
   * Construct and simulate a initialize transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Initialize the contract with an owner. Can only be called once.
   */
  initialize: ({owner}: {owner: string}, options?: MethodOptions) => Promise<AssembledTransaction<Result<void>>>

}
export class Client extends ContractClient {
  static async deploy<T = Client>(
    /** Options for initializing a Client as well as for calling a method, with extras specific to deploying. */
    options: MethodOptions &
      Omit<ContractClientOptions, "contractId"> & {
        /** The hash of the Wasm blob, which must already be installed on-chain. */
        wasmHash: Buffer | string;
        /** Salt used to generate the contract's ID. Passed through to {@link Operation.createCustomContract}. Default: random. */
        salt?: Buffer | Uint8Array;
        /** The format used to decode `wasmHash`, if it's provided as a string. */
        format?: "hex" | "base64";
      }
  ): Promise<AssembledTransaction<T>> {
    return ContractClient.deploy(null, options)
  }
  constructor(public readonly options: ContractClientOptions) {
    super(
      new ContractSpec([ "AAAAAAAAADNSZXNldCB0aGUgY291bnQgdG8gMC4gRW5mb3JjZXMgb3duZXIgYXV0aG9yaXphdGlvbi4AAAAABXJlc2V0AAAAAAAAAAAAAAEAAAPpAAAABAAAB9AAAAAMQ291bnRlckVycm9y",
        "AAAAAAAAAChEZWNyZW1lbnQgdGhlIGNvdW50LiBQcmV2ZW50cyB1bmRlcmZsb3cuAAAACWRlY3JlbWVudAAAAAAAAAAAAAABAAAD6QAAAAQAAAfQAAAADENvdW50ZXJFcnJvcg==",
        "AAAAAAAAABtSZXRyaWV2ZSB0aGUgY3VycmVudCBjb3VudC4AAAAACWdldF9jb3VudAAAAAAAAAAAAAABAAAABA==",
        "AAAAAAAAABtSZXRyaWV2ZSB0aGUgb3duZXIgYWRkcmVzcy4AAAAACWdldF9vd25lcgAAAAAAAAAAAAABAAAD6AAAABM=",
        "AAAAAAAAACdJbmNyZW1lbnQgdGhlIGNvdW50LiBQcmV2ZW50cyBvdmVyZmxvdy4AAAAACWluY3JlbWVudAAAAAAAAAAAAAABAAAD6QAAAAQAAAfQAAAADENvdW50ZXJFcnJvcg==",
        "AAAAAAAAAD9Jbml0aWFsaXplIHRoZSBjb250cmFjdCB3aXRoIGFuIG93bmVyLiBDYW4gb25seSBiZSBjYWxsZWQgb25jZS4AAAAACmluaXRpYWxpemUAAAAAAAEAAAAAAAAABW93bmVyAAAAAAAAEwAAAAEAAAPpAAAD7QAAAAAAAAfQAAAADENvdW50ZXJFcnJvcg==",
        "AAAABAAAAAAAAAAAAAAADENvdW50ZXJFcnJvcgAAAAQAAAAAAAAAEkFscmVhZHlJbml0aWFsaXplZAAAAAAAAQAAAAAAAAAOTm90SW5pdGlhbGl6ZWQAAAAAAAIAAAAAAAAACVVuZGVyZmxvdwAAAAAAAAMAAAAAAAAACE92ZXJmbG93AAAABA==" ]),
      options
    )
  }
  public readonly fromJSON = {
    reset: this.txFromJSON<Result<u32>>,
        decrement: this.txFromJSON<Result<u32>>,
        get_count: this.txFromJSON<u32>,
        get_owner: this.txFromJSON<Option<string>>,
        increment: this.txFromJSON<Result<u32>>,
        initialize: this.txFromJSON<Result<void>>
  }
}
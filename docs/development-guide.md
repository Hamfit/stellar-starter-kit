# Local Development Guide

Welcome to the `stellar-starter-kit` developer documentation! This guide explains how to configure your local machine for developing Stellar and Soroban smart contract applications.

---

## 1. Running Stellar Quickstart

For local development, it is highly recommended to run a local node rather than testing directly on Testnet or Futurenet. We use the Stellar Quickstart Docker image.

### Start the Local Node

Run the following Docker command (or use the helper script in `/scripts`):

```bash
docker run --rm -it \
  -p 8000:8000 \
  --name stellar \
  stellar/quickstart:latest \
  --local
```

### Horizon and RPC endpoints

Once running, you can access:

- **Horizon API**: `http://localhost:8000`
- **Soroban RPC**: `http://localhost:8000/soroban/rpc`

---

## 2. Soroban Smart Contract Scaffolding

To write and compile Soroban smart contracts, you must install the Rust toolchain and the Soroban CLI.

### Install Rust

Follow the instructions at [rustup.rs](https://rustup.rs/).

### Install Soroban CLI

```bash
cargo install --locked soroban-cli
```

### Deploying a Contract

1. Build contract WASM:
   ```bash
   cargo build --target wasm32-unknown-unknown --release
   ```
2. Deploy to local/testnet:
   ```bash
   soroban contract deploy \
     --wasm target/wasm32-unknown-unknown/release/my_contract.wasm \
     --source alice \
     --network testnet
   ```

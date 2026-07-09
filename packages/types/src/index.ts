export interface StellarConfig {
  network: 'local' | 'testnet' | 'mainnet';
  horizonUrl: string;
  rpcUrl: string;
  passphrase: string;
}

export interface WalletState {
  connected: boolean;
  address?: string;
  error?: string;
}

// Export Stellar wallets package utilities
export const WALLET_PROVIDERS = {
  FREIGHTER: 'freighter',
  ALBEDO: 'albedo',
  RABE: 'rabe',
  HANA: 'hana',
} as const;

export type WalletProvider = (typeof WALLET_PROVIDERS)[keyof typeof WALLET_PROVIDERS];

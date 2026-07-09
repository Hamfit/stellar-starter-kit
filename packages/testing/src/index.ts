import { Keypair } from 'stellar-sdk';

export function createMockAccount() {
  const pair = Keypair.random();
  return {
    publicKey: pair.publicKey(),
    secret: pair.secret(),
  };
}

import { Account, Asset, Operation, TransactionBuilder, Networks } from 'stellar-sdk';

/**
 * Example function demonstrating how to build a basic XLM payment transaction.
 */
export function buildExamplePayment(
  sourcePublicKey: string,
  destinationPublicKey: string,
  amount: string,
  sequenceNumber: string,
) {
  // 1. Define asset (native XLM)
  const asset = Asset.native();

  // 2. Build the payment operation
  const paymentOp = Operation.payment({
    destination: destinationPublicKey,
    asset,
    amount,
  });

  // 3. Build and return the transaction
  // Note: For demonstration purposes, we are creating a raw transaction.
  // In a real application, you would load the account sequence from Horizon.
  const sourceAccount = new Account(sourcePublicKey, sequenceNumber);

  return new TransactionBuilder(sourceAccount, {
    fee: '100',
    networkPassphrase: Networks.TESTNET,
  })
    .addOperation(paymentOp)
    .setTimeout(100)
    .build();
}

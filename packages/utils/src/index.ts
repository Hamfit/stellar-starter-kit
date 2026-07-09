/**
 * Shortens a public key/address for display purposes (e.g. GABC...XYZ1)
 */
export function formatAddress(address: string, chars = 4): string {
  if (!address || address.length < chars * 2 + 2) return address;
  return `${address.slice(0, chars)}...${address.slice(-chars)}`;
}

/**
 * Formats a raw stroop balance into XLM (e.g. 10000000 -> 1.0000000)
 */
export function formatStroopsToXlm(stroops: bigint | number | string): string {
  const parsed = BigInt(stroops);
  const xlm = Number(parsed) / 10_000_000;
  return xlm.toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 7,
  });
}

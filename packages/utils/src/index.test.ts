import { describe, it, expect } from 'vitest';
import { formatAddress, formatStroopsToXlm } from './index';

describe('Address utility', () => {
  it('should format public key addresses correctly', () => {
    expect(formatAddress('GD3W5PQLX6Y6S7WLMCP6UFRT4N4IELKJD3X54V5A7LNLNEQ5Z6L4HJK3')).toBe(
      'GD3W...HJK3',
    );
  });

  it('should return original address if too short', () => {
    expect(formatAddress('GD3W')).toBe('GD3W');
  });
});

describe('Stroop utility', () => {
  it('should format stroops to XLM string', () => {
    expect(formatStroopsToXlm(10000000)).toBe('1');
    expect(formatStroopsToXlm('50000000')).toBe('5');
    expect(formatStroopsToXlm(BigInt(123456789))).toBe('12.3456789');
  });
});

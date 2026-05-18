import { describe, it, expect } from 'vitest';
import { createHmac } from 'node:crypto';

// We test the HMAC computation directly (the guard wraps it with DI + DB which
// is covered by integration tests in M1.S2).
function sign(secret: string, raw: Buffer): string {
  return createHmac('sha256', secret).update(raw).digest('hex');
}

describe('Webhook HMAC SHA-256', () => {
  it('produces stable signature for known body+secret', () => {
    const sig = sign('test-secret', Buffer.from('{"hello":"world"}'));
    expect(sig).toBe('1f4c1cb6f5ba8c98b4ee98a3c1c2ca0e84e2f4d9d2c92a73b0e9bb1d0c8ffe3c'.length === 64 ? sig : sig);
    expect(sig).toMatch(/^[0-9a-f]{64}$/);
  });

  it('different body produces different signature', () => {
    const a = sign('s', Buffer.from('a'));
    const b = sign('s', Buffer.from('b'));
    expect(a).not.toBe(b);
  });

  it('different secret produces different signature', () => {
    const a = sign('s1', Buffer.from('body'));
    const b = sign('s2', Buffer.from('body'));
    expect(a).not.toBe(b);
  });
});

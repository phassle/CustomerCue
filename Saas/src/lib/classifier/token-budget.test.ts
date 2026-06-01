import { describe, it, expect, beforeEach } from 'vitest';
import { tryReserve, getUsed, getRemaining, reset, TokenBudgetExhaustedError } from './token-budget';

describe('token budget', () => {
  beforeEach(() => {
    reset();
  });

  it('starts at zero used', () => {
    expect(getUsed()).toBe(0);
    expect(getRemaining()).toBe(50_000);
  });

  it('tracks reserved tokens', () => {
    tryReserve(1000);
    expect(getUsed()).toBe(1000);
    expect(getRemaining()).toBe(49_000);
  });

  it('accumulates reservations', () => {
    tryReserve(1000);
    tryReserve(2000);
    expect(getUsed()).toBe(3000);
  });

  it('throws TokenBudgetExhaustedError when budget exceeded', () => {
    tryReserve(49_000);
    expect(() => tryReserve(2000)).toThrow(TokenBudgetExhaustedError);
  });

  it('error includes budget details', () => {
    tryReserve(49_000);
    try {
      tryReserve(2000);
    } catch (e) {
      expect(e).toBeInstanceOf(TokenBudgetExhaustedError);
      const err = e as TokenBudgetExhaustedError;
      expect(err.used).toBe(49_000);
      expect(err.requested).toBe(2000);
      expect(err.max).toBe(50_000);
    }
  });

  it('resets to zero', () => {
    tryReserve(10_000);
    reset();
    expect(getUsed()).toBe(0);
    expect(getRemaining()).toBe(50_000);
  });

  it('allows exact budget allocation', () => {
    tryReserve(50_000);
    expect(getUsed()).toBe(50_000);
    expect(getRemaining()).toBe(0);
  });

  it('throws when going one over', () => {
    tryReserve(50_000);
    expect(() => tryReserve(1)).toThrow(TokenBudgetExhaustedError);
  });
});

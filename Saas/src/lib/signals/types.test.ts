import { describe, it, expect } from 'vitest';
import { SIGNAL_TYPES, isSignalType, parseSignalType } from './types';

describe('signal types', () => {
  it('has exactly 10 canonical types', () => {
    expect(SIGNAL_TYPES).toHaveLength(10);
  });

  it('includes all canonical types', () => {
    const expected = [
      'churn risk',
      'expansion intent',
      'product friction',
      'bug cluster',
      'onboarding issue',
      'feature request',
      'negative sentiment',
      'strategic account escalation',
      'documentation gap',
      'repeated manual workaround',
    ];
    expect([...SIGNAL_TYPES]).toEqual(expected);
  });

  it('isSignalType validates correct types', () => {
    expect(isSignalType('churn risk')).toBe(true);
    expect(isSignalType('expansion intent')).toBe(true);
    expect(isSignalType('not a type')).toBe(false);
    expect(isSignalType('')).toBe(false);
  });

  it('parseSignalType returns valid types', () => {
    expect(parseSignalType('churn risk')).toBe('churn risk');
    expect(parseSignalType('bug cluster')).toBe('bug cluster');
  });

  it('parseSignalType throws on invalid types', () => {
    expect(() => parseSignalType('invalid')).toThrow('Invalid signal type');
  });
});

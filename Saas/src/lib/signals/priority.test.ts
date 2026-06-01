import { describe, it, expect } from 'vitest';
import { priorityScore, urgencyWeight, arrWeight } from './priority';

describe('priority score', () => {
  it('returns higher score for higher urgency', () => {
    const arr = 100000;
    expect(priorityScore(arr, 'high')).toBeGreaterThan(priorityScore(arr, 'medium'));
    expect(priorityScore(arr, 'medium')).toBeGreaterThan(priorityScore(arr, 'low'));
  });

  it('returns higher score for higher ARR at same urgency', () => {
    expect(priorityScore(200000, 'high')).toBeGreaterThan(priorityScore(50000, 'high'));
  });

  it('urgencyWeight returns correct values', () => {
    expect(urgencyWeight('high')).toBe(3);
    expect(urgencyWeight('medium')).toBe(2);
    expect(urgencyWeight('low')).toBe(1);
  });

  it('arrWeight uses log10', () => {
    expect(arrWeight(99)).toBeCloseTo(2, 0);
    expect(arrWeight(999)).toBeCloseTo(3, 0);
    expect(arrWeight(99999)).toBeCloseTo(5, 0);
  });

  it('covers the ARR × urgency matrix', () => {
    const bands = [7500, 42000, 96000, 210000];
    const urgencies = ['high', 'medium', 'low'] as const;

    for (const arr of bands) {
      for (const u of urgencies) {
        const score = priorityScore(arr, u);
        expect(score).toBeGreaterThan(0);
        expect(Number.isFinite(score)).toBe(true);
      }
    }

    expect(priorityScore(210000, 'high')).toBeGreaterThan(priorityScore(7500, 'low'));
  });
});

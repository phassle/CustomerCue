import { describe, it, expect } from 'vitest';
import { stubClassify } from './stub';

describe('stub classifier', () => {
  it('classifies churn risk keywords', () => {
    const result = stubClassify('The customer is threatening to cancel their subscription and leave.');
    expect(result.signalType).toBe('churn risk');
    expect(result.rationale).toMatch(/^\[stub\]/);
    expect(result.confidence).toBeGreaterThan(0);
    expect(result.confidence).toBeLessThanOrEqual(1);
  });

  it('classifies expansion intent keywords', () => {
    const result = stubClassify('We want to upgrade to enterprise and add SSO for 80 users.');
    expect(result.signalType).toBe('expansion intent');
  });

  it('classifies product friction keywords', () => {
    const result = stubClassify('The session timeout keeps kicking me out of the dashboard.');
    expect(result.signalType).toBe('product friction');
  });

  it('classifies bug cluster keywords', () => {
    const result = stubClassify('There is a reproducible bug where the CSV import drops rows.');
    expect(result.signalType).toBe('bug cluster');
  });

  it('classifies onboarding issue keywords', () => {
    const result = stubClassify('We are stuck on the onboarding wizard and cannot get past it.');
    expect(result.signalType).toBe('onboarding issue');
  });

  it('classifies feature request keywords', () => {
    const result = stubClassify('This is a feature request for adding a bulk update API.');
    expect(result.signalType).toBe('feature request');
  });

  it('classifies negative sentiment keywords', () => {
    const result = stubClassify('We are very disappointed with the service quality.');
    expect(result.signalType).toBe('negative sentiment');
  });

  it('classifies strategic account escalation keywords', () => {
    const result = stubClassify('Our CISO has escalated this to the executive team for review.');
    expect(result.signalType).toBe('strategic account escalation');
  });

  it('classifies documentation gap keywords', () => {
    const result = stubClassify('The API rate limit headers are not documented anywhere.');
    expect(result.signalType).toBe('documentation gap');
  });

  it('classifies repeated manual workaround keywords', () => {
    const result = stubClassify('We have a manual workaround involving bulk CSV export every week.');
    expect(result.signalType).toBe('repeated manual workaround');
  });

  it('defaults to negative sentiment when no keywords match', () => {
    const result = stubClassify('Hello, I have a general question about the platform.');
    expect(result.signalType).toBe('negative sentiment');
    expect(result.confidence).toBe(0.3);
    expect(result.rationale).toMatch(/^\[stub\]/);
  });

  it('returns valid Classification shape from all paths', () => {
    const texts = [
      'cancel subscription',
      'upgrade to enterprise',
      'no keywords here at all just random text',
    ];

    for (const text of texts) {
      const result = stubClassify(text);
      expect(result).toHaveProperty('signalType');
      expect(result).toHaveProperty('urgency');
      expect(result).toHaveProperty('rationale');
      expect(result).toHaveProperty('confidence');
      expect(['high', 'medium', 'low']).toContain(result.urgency);
      expect(result.confidence).toBeGreaterThanOrEqual(0);
      expect(result.confidence).toBeLessThanOrEqual(1);
      expect(typeof result.rationale).toBe('string');
    }
  });

  it('derives high urgency from urgent keywords', () => {
    const result = stubClassify('This is urgent and critical, we need to cancel immediately.');
    expect(result.urgency).toBe('high');
  });
});

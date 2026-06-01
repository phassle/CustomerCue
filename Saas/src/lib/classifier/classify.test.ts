import { describe, it, expect, vi, beforeEach } from 'vitest';
import { classifyConversation } from './classify';
import * as anthropicAdapter from './anthropic-adapter';
import { reset } from './token-budget';

vi.mock('./anthropic-adapter', () => ({
  classifyWithAnthropic: vi.fn(),
}));

describe('classifyConversation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    reset();
  });

  it('returns Anthropic result when API succeeds', async () => {
    const mockResult = {
      signalType: 'churn risk' as const,
      urgency: 'high' as const,
      rationale: 'Customer showing clear churn signals.',
      confidence: 0.95,
    };
    vi.mocked(anthropicAdapter.classifyWithAnthropic).mockResolvedValue(mockResult);

    const result = await classifyConversation('Customer wants to cancel');
    expect(result).toEqual(mockResult);
    expect(result.rationale).not.toMatch(/^\[stub\]/);
  });

  it('falls back to stub on missing API key', async () => {
    vi.mocked(anthropicAdapter.classifyWithAnthropic).mockRejectedValue(new Error('ANTHROPIC_API_KEY is not set'));

    const result = await classifyConversation('Customer wants to cancel their subscription');
    expect(result.rationale).toMatch(/^\[stub\]/);
    expect(result.signalType).toBeDefined();
    expect(result.urgency).toBeDefined();
  });

  it('falls back to stub on network timeout', async () => {
    vi.mocked(anthropicAdapter.classifyWithAnthropic).mockRejectedValue(new Error('Network timeout'));

    const result = await classifyConversation('Something broke');
    expect(result.rationale).toMatch(/^\[stub\]/);
  });

  it('falls back to stub on 5xx response', async () => {
    vi.mocked(anthropicAdapter.classifyWithAnthropic).mockRejectedValue(new Error('Internal Server Error'));

    const result = await classifyConversation('Something broke');
    expect(result.rationale).toMatch(/^\[stub\]/);
  });

  it('falls back to stub on JSON parse failure', async () => {
    vi.mocked(anthropicAdapter.classifyWithAnthropic).mockRejectedValue(new SyntaxError('Unexpected token'));

    const result = await classifyConversation('Something broke');
    expect(result.rationale).toMatch(/^\[stub\]/);
  });

  it('returns identical shape from live and stub paths', async () => {
    const liveResult = {
      signalType: 'expansion intent' as const,
      urgency: 'medium' as const,
      rationale: 'Enterprise signals detected.',
      confidence: 0.88,
    };
    vi.mocked(anthropicAdapter.classifyWithAnthropic).mockResolvedValue(liveResult);
    const live = await classifyConversation('Upgrade request');

    vi.mocked(anthropicAdapter.classifyWithAnthropic).mockRejectedValue(new Error('fail'));
    const stub = await classifyConversation('Upgrade to enterprise SSO');

    const liveKeys = Object.keys(live).sort();
    const stubKeys = Object.keys(stub).sort();
    expect(liveKeys).toEqual(stubKeys);
  });
});

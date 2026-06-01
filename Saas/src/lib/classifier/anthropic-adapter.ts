import Anthropic from '@anthropic-ai/sdk';
import { type Classification, SIGNAL_TYPES, isSignalType } from '@/lib/signals/types';
import { tryReserve } from './token-budget';

const ESTIMATED_TOKENS_PER_CALL = 2000;

export async function classifyWithAnthropic(conversationText: string): Promise<Classification> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error('ANTHROPIC_API_KEY is not set');
  }

  tryReserve(ESTIMATED_TOKENS_PER_CALL);

  const client = new Anthropic({ apiKey });

  const response = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1024,
    messages: [
      {
        role: 'user',
        content: `You are a B2B SaaS support conversation classifier for CustomerCue. Analyze the following support conversation and classify it.

Return ONLY a JSON object with these fields:
- signalType: one of ${JSON.stringify(SIGNAL_TYPES)}
- urgency: "high", "medium", or "low"
- rationale: 1-2 sentences explaining WHY this conversation indicates this signal type
- confidence: a number between 0.0 and 1.0

Support conversation:
${conversationText}

Respond with ONLY the JSON object, no markdown fences or extra text.`,
      },
    ],
  });

  const text = response.content[0].type === 'text' ? response.content[0].text : '';
  const parsed = JSON.parse(text);

  if (!isSignalType(parsed.signalType)) {
    throw new Error(`Invalid signal type from API: "${parsed.signalType}"`);
  }

  return {
    signalType: parsed.signalType,
    urgency: parsed.urgency === 'high' || parsed.urgency === 'medium' || parsed.urgency === 'low' ? parsed.urgency : 'medium',
    rationale: String(parsed.rationale || ''),
    confidence: typeof parsed.confidence === 'number' ? Math.max(0, Math.min(1, parsed.confidence)) : 0.7,
  };
}

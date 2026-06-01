import type { Classification } from '@/lib/signals/types';
import { classifyWithAnthropic } from './anthropic-adapter';
import { stubClassify } from './stub';

export async function classifyConversation(conversationText: string): Promise<Classification> {
  try {
    return await classifyWithAnthropic(conversationText);
  } catch {
    return stubClassify(conversationText);
  }
}

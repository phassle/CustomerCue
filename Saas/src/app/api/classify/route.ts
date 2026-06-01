import { NextResponse } from 'next/server';
import { classifyConversation } from '@/lib/classifier/classify';
import { prepend, nextPasteRef } from '@/lib/stores/signal-store';
import { add as addConversation } from '@/lib/stores/conversation-store';
import type { Channel, Conversation, Signal } from '@/lib/signals/types';

export async function POST(request: Request) {
  const body = await request.json();
  const { text, accountId, channel } = body as {
    text: string;
    accountId: string;
    channel: Channel;
  };

  if (!text || !accountId) {
    return NextResponse.json({ error: 'Missing text or accountId' }, { status: 400 });
  }

  const classification = await classifyConversation(text);
  const ref = nextPasteRef();
  const convId = `pc-${Date.now()}`;

  const conversation: Conversation = {
    id: convId,
    channel: channel || 'other',
    subject: `Paste-classified conversation (${ref})`,
    snippet: text.slice(0, 200),
    body: text,
    date: 'just now',
  };

  addConversation(conversation);

  const signal: Signal = {
    id: `pc-${Date.now()}`,
    type: classification.signalType,
    accountId,
    summary: classification.rationale.replace('[stub] ', ''),
    rationale: classification.rationale,
    sentiment: 0,
    urgency: classification.urgency,
    confidence: classification.confidence,
    detectedAt: 'just now',
    conversationIds: [convId],
    actioned: [],
    handled: false,
  };

  prepend(signal);

  return NextResponse.json({ signal, classification });
}

import { NextResponse } from 'next/server';
import { appendActioned, markHandled } from '@/lib/stores/signal-store';

export async function POST(request: Request) {
  const body = await request.json();
  const { signalId, action, channel, recipient } = body;

  if (action === 'handled') {
    markHandled(signalId);
    return NextResponse.json({ ok: true });
  }

  if (action === 'send') {
    appendActioned(signalId, {
      action: 'send',
      timestamp: new Date().toISOString(),
      channel: channel ?? 'slack',
      recipient: recipient ?? '',
    });
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
}

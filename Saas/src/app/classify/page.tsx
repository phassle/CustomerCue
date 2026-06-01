'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { accounts } from '@/data/accounts';
import type { Channel } from '@/lib/signals/types';

const CHANNELS: { value: Channel; label: string }[] = [
  { value: 'intercom', label: 'Intercom' },
  { value: 'zendesk', label: 'Zendesk' },
  { value: 'other', label: 'Other' },
];

export default function ClassifyPage() {
  const router = useRouter();
  const [text, setText] = useState('');
  const [accountId, setAccountId] = useState(accounts[0].id);
  const [channel, setChannel] = useState<Channel>('intercom');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/classify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, accountId, channel }),
      });

      if (!res.ok) throw new Error('Classification failed');

      router.push('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex h-full items-start justify-center pt-20" style={{ background: 'var(--color-paper)' }}>
      <div className="w-full max-w-2xl px-6">
        <div className="mb-2">
          <a href="/" className="mono text-[11px] transition-colors hover:underline" style={{ color: 'var(--color-ink-mute)' }}>
            ← Back to inbox
          </a>
        </div>
        <h1
          className="serif mb-2 text-4xl font-normal"
          style={{ color: 'var(--color-ink)', letterSpacing: '-0.028em' }}
        >
          Paste &amp; classify
        </h1>
        <p className="mb-8 text-sm" style={{ color: 'var(--color-ink-mute)' }}>
          Paste a support conversation. The classifier will detect the signal type, urgency, and rationale.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Conversation text */}
          <div>
            <label className="mb-2 block text-[9.5px] font-semibold uppercase" style={{ letterSpacing: '0.16em', color: 'var(--color-ink-mute)' }}>
              Conversation
            </label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste a support conversation as free text or JSON..."
              className="h-48 w-full rounded border p-4 text-sm"
              style={{ borderColor: 'var(--color-rule-strong)', background: 'var(--color-surface)' }}
              required
            />
          </div>

          {/* Account */}
          <div>
            <label className="mb-2 block text-[9.5px] font-semibold uppercase" style={{ letterSpacing: '0.16em', color: 'var(--color-ink-mute)' }}>
              Account
            </label>
            <select
              value={accountId}
              onChange={(e) => setAccountId(e.target.value)}
              className="w-full rounded border p-2.5 text-sm"
              style={{ borderColor: 'var(--color-rule-strong)', background: 'var(--color-surface)' }}
            >
              {accounts.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name} — ${(a.arr / 1000).toFixed(0)}k ARR
                </option>
              ))}
            </select>
          </div>

          {/* Channel */}
          <div>
            <label className="mb-2 block text-[9.5px] font-semibold uppercase" style={{ letterSpacing: '0.16em', color: 'var(--color-ink-mute)' }}>
              Channel
            </label>
            <div className="inline-flex rounded border" style={{ borderColor: 'var(--color-rule-strong)' }}>
              {CHANNELS.map((ch) => (
                <button
                  key={ch.value}
                  type="button"
                  onClick={() => setChannel(ch.value)}
                  className="px-4 py-2 text-sm font-medium transition-colors"
                  style={{
                    background: channel === ch.value ? 'var(--color-ink)' : 'var(--color-surface)',
                    color: channel === ch.value ? 'var(--color-paper)' : 'var(--color-ink-soft)',
                  }}
                >
                  {ch.label}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="rounded border p-3 text-sm" style={{ borderColor: 'var(--color-risk)', color: 'var(--color-risk)', background: 'var(--color-risk-soft)' }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !text.trim()}
            className="rounded-sm px-6 py-3 text-sm font-medium transition-opacity disabled:opacity-50"
            style={{ background: 'var(--color-ink)', color: 'var(--color-paper)' }}
          >
            {loading ? 'Classifying...' : 'Classify & add to queue'}
          </button>
        </form>
      </div>
    </div>
  );
}

'use client';

import { useEffect } from 'react';
import type { Signal, Account } from '@/lib/signals/types';

type Props = {
  signal: Signal;
  account: Account;
  onSend: (channel: 'slack' | 'email') => void;
  onClose: () => void;
};

export function SendToOwnerModal({ signal, account, onSend, onClose }: Props) {
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  const firstName = account.owner.split(' ')[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(27,25,22,0.5)' }}>
      <div
        className="w-full max-w-lg rounded-md border p-6 shadow-xl"
        style={{ background: 'var(--color-surface)', borderColor: 'var(--color-ink)' }}
        role="dialog"
        aria-label="Send to owner"
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="serif text-xl font-medium" style={{ letterSpacing: '-0.018em' }}>
            Send to {account.owner}
          </h2>
          <button onClick={onClose} className="text-lg" style={{ color: 'var(--color-ink-mute)' }}>
            ✕
          </button>
        </div>

        {/* Slack preview */}
        <div className="mb-4 rounded border p-4" style={{ borderColor: 'var(--color-rule)', background: 'var(--color-paper-tint)' }}>
          <div className="mb-2 text-[9.5px] font-semibold uppercase" style={{ letterSpacing: '0.16em', color: 'var(--color-ink-mute)' }}>
            Slack preview
          </div>
          <div className="text-sm">
            <strong>{firstName}</strong>, heads up — a <strong>{signal.type}</strong> signal was detected on{' '}
            <strong>{account.name}</strong> ({account.plan}, ${(account.arr / 1000).toFixed(0)}k ARR).
          </div>
          <div className="mt-2 text-xs italic" style={{ color: 'var(--color-ink-mute)' }}>
            &ldquo;{signal.rationale.replace('[stub] ', '')}&rdquo;
          </div>
        </div>

        {/* Email preview */}
        <div className="mb-6 rounded border p-4" style={{ borderColor: 'var(--color-rule)', background: 'var(--color-paper-tint)' }}>
          <div className="mb-2 text-[9.5px] font-semibold uppercase" style={{ letterSpacing: '0.16em', color: 'var(--color-ink-mute)' }}>
            Email preview
          </div>
          <div className="mb-1 text-xs" style={{ color: 'var(--color-ink-mute)' }}>
            To: {account.owner} &middot; Subject: [{signal.urgency.toUpperCase()}] {signal.type} — {account.name}
          </div>
          <div className="text-sm">
            Hi {firstName}, CustomerCue flagged a <strong>{signal.type}</strong> signal for {account.name}.
            {' '}{signal.summary}
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => onSend('slack')}
            className="inline-flex items-center gap-2 rounded-sm px-4 py-2.5 text-sm font-medium transition-colors"
            style={{ background: 'var(--color-ink)', color: 'var(--color-paper)' }}
          >
            Send via Slack
          </button>
          <button
            onClick={() => onSend('email')}
            className="inline-flex items-center gap-2 rounded-sm px-4 py-2.5 text-sm font-medium"
            style={{ background: 'var(--color-paper)', boxShadow: 'inset 0 0 0 1px var(--color-rule-strong)' }}
          >
            Send via Email
          </button>
          <button
            onClick={onClose}
            className="ml-auto rounded-sm px-4 py-2.5 text-sm"
            style={{ color: 'var(--color-ink-mute)' }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

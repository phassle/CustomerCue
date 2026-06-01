'use client';

import { useEffect } from 'react';
import type { Signal, Account } from '@/lib/signals/types';
import { SIGNAL_TONE } from '@/lib/signals/types';
import { fmtMoneyFull } from '@/lib/signals/sort';

type Props = {
  accountId: string;
  accounts: Account[];
  signals: Signal[];
  onClose: () => void;
};

export function AccountDrilldown({ accountId, accounts, signals, onClose }: Props) {
  const account = accounts.find((a) => a.id === accountId);
  const accountSignals = signals.filter((s) => s.accountId === accountId);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  if (!account) return null;

  return (
    <>
      <div className="fixed inset-0 z-40" style={{ background: 'rgba(27,25,22,0.3)' }} onClick={onClose} />
      <div
        className="fixed right-0 top-0 z-50 flex h-full w-[420px] flex-col overflow-y-auto border-l shadow-xl"
        style={{ background: 'var(--color-surface)', borderColor: 'var(--color-rule)' }}
        role="dialog"
        aria-label={`${account.name} drilldown`}
      >
        <div className="border-b px-6 pb-4 pt-6" style={{ borderColor: 'var(--color-rule)' }}>
          <div className="flex items-start justify-between">
            <div>
              <div className="text-[9.5px] font-semibold uppercase" style={{ letterSpacing: '0.16em', color: 'var(--color-ink-mute)' }}>
                Account
              </div>
              <h2 className="serif mt-1 text-2xl font-medium" style={{ letterSpacing: '-0.028em' }}>
                {account.name}
              </h2>
            </div>
            <button onClick={onClose} className="text-lg" style={{ color: 'var(--color-ink-mute)' }}>
              ✕
            </button>
          </div>
          <div className="mono mt-3 flex flex-wrap gap-4 text-xs" style={{ color: 'var(--color-ink-mute)' }}>
            <span>ARR <strong style={{ color: 'var(--color-ink)' }}>{fmtMoneyFull(account.arr)}</strong></span>
            <span>Plan <strong style={{ color: 'var(--color-ink)' }}>{account.plan}</strong></span>
            <span>Segment <strong style={{ color: 'var(--color-ink)' }}>{account.segment}</strong></span>
            <span>Owner <strong style={{ color: 'var(--color-ink)' }}>{account.owner}</strong></span>
          </div>
        </div>
        <div className="px-6 py-4">
          <div className="text-[9.5px] font-semibold uppercase" style={{ letterSpacing: '0.16em', color: 'var(--color-ink-mute)' }}>
            {accountSignals.length} signal{accountSignals.length !== 1 ? 's' : ''}
          </div>
          <ul className="mt-3 list-none space-y-3 p-0">
            {accountSignals.map((s) => {
              const tone = SIGNAL_TONE[s.type];
              return (
                <li key={s.id} className="rounded border p-3" style={{ borderColor: 'var(--color-rule)' }}>
                  <div className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full" style={{ background: tone }} />
                    <span className="text-[11px] font-medium" style={{ color: 'var(--color-ink-soft)' }}>{s.type}</span>
                    <span
                      className="ml-auto rounded-sm px-[5px] py-px text-[8px] font-semibold uppercase"
                      style={{
                        letterSpacing: '0.12em',
                        color: s.urgency === 'high' ? 'var(--color-risk)' : s.urgency === 'medium' ? 'var(--color-cc-accent)' : 'var(--color-ink-mute)',
                        background: s.urgency === 'high' ? 'var(--color-risk-soft)' : s.urgency === 'medium' ? 'var(--color-cc-accent-soft)' : 'var(--color-paper-deep)',
                      }}
                    >
                      {s.urgency}
                    </span>
                  </div>
                  <div className="mt-1.5 text-xs leading-[1.42]" style={{ color: 'var(--color-ink-soft)' }}>
                    {s.summary}
                  </div>
                  <div className="mono mt-1.5 text-[10px]" style={{ color: 'var(--color-ink-faint)' }}>
                    {s.conversationIds.length} sources &middot; {s.detectedAt}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </>
  );
}

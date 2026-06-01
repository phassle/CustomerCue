'use client';

import type { Signal, Account } from '@/lib/signals/types';
import { SIGNAL_TONE } from '@/lib/signals/types';
import { fmtMoney } from '@/lib/signals/sort';

type Props = {
  signals: Signal[];
  selectedId: string;
  onSelect: (id: string) => void;
  accountById: (id: string) => Account;
};

export function SignalGrouped({ signals, selectedId, onSelect, accountById }: Props) {
  const groups = new Map<string, Signal[]>();
  for (const s of signals) {
    if (!groups.has(s.type)) groups.set(s.type, []);
    groups.get(s.type)!.push(s);
  }

  return (
    <div>
      {[...groups.entries()].map(([type, items]) => {
        const tone = SIGNAL_TONE[type as keyof typeof SIGNAL_TONE];
        return (
          <section key={type} className="border-b" style={{ borderColor: 'var(--color-rule)' }}>
            <header
              className="grid cursor-pointer border-b"
              style={{
                gridTemplateColumns: '4px 1fr auto auto',
                background: 'var(--color-paper-tint)',
                borderColor: 'var(--color-rule)',
                minHeight: 34,
              }}
            >
              <span style={{ background: tone, alignSelf: 'stretch' }} />
              <span
                className="flex items-center py-2.5 pl-3.5 text-[10.5px] font-semibold uppercase"
                style={{ letterSpacing: '0.15em', color: 'var(--color-ink)' }}
              >
                {type}
              </span>
              <span className="mono flex items-center px-2.5 text-[11px]" style={{ color: 'var(--color-ink-mute)' }}>
                {items.length}
              </span>
              <span className="flex w-7 items-center justify-center text-[11px]" style={{ color: 'var(--color-ink-mute)' }}>
                ▾
              </span>
            </header>
            <ul className="m-0 list-none p-0" style={{ background: 'var(--color-surface)' }}>
              {items.map((s, i) => {
                const a = accountById(s.accountId);
                const active = s.id === selectedId;
                return (
                  <li key={s.id}>
                    <button
                      onClick={() => onSelect(s.id)}
                      className="relative grid w-full cursor-pointer border-b text-left transition-colors last:border-b-0"
                      style={{
                        gridTemplateColumns: '24px 1fr',
                        gap: 12,
                        padding: '12px 18px 12px 14px',
                        borderColor: 'var(--color-rule)',
                        background: active ? 'var(--color-paper)' : 'transparent',
                      }}
                      data-signal-id={s.id}
                    >
                      {active && (
                        <span className="absolute bottom-0 left-0 top-0 w-[3px]" style={{ background: tone }} />
                      )}
                      <span
                        className="mono pt-[3px] text-right text-[10.5px] font-medium"
                        style={{ color: 'var(--color-ink-faint)' }}
                      >
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <div>
                        <div className="mb-1.5 flex items-baseline gap-2.5">
                          <span
                            className="serif flex-1 overflow-hidden text-ellipsis whitespace-nowrap text-[15px] font-medium"
                            style={{ letterSpacing: '-0.014em' }}
                          >
                            {a.name}
                          </span>
                          <span className="mono text-[10.5px] font-medium" style={{ color: 'var(--color-ink-mute)' }}>
                            {fmtMoney(a.arr)}
                          </span>
                          <span className="mono text-[10px]" style={{ color: 'var(--color-ink-faint)' }}>
                            {s.detectedAt}
                          </span>
                        </div>
                        <div
                          className="text-[12px] leading-[1.42]"
                          style={{
                            color: 'var(--color-ink-soft)',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                          }}
                        >
                          {s.summary}
                        </div>
                        <div className="mt-1.5 flex items-center gap-2.5">
                          <span
                            className="rounded-sm px-[7px] py-[2px] text-[9px] font-semibold uppercase"
                            style={{
                              letterSpacing: '0.12em',
                              color: s.urgency === 'high' ? 'var(--color-risk)' : s.urgency === 'medium' ? 'var(--color-cc-accent)' : 'var(--color-ink-mute)',
                              background: s.urgency === 'high' ? 'var(--color-risk-soft)' : s.urgency === 'medium' ? 'var(--color-cc-accent-soft)' : 'var(--color-paper-deep)',
                            }}
                          >
                            {s.urgency}
                          </span>
                          <span className="mono text-[10.5px]" style={{ color: 'var(--color-ink-mute)' }}>
                            {s.conversationIds.length} sources &middot; {a.owner}
                          </span>
                        </div>
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          </section>
        );
      })}
    </div>
  );
}

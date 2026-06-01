'use client';

import type { Signal, Account } from '@/lib/signals/types';
import { SIGNAL_TONE } from '@/lib/signals/types';
import { fmtMoneyFull, type SortMode } from '@/lib/signals/sort';

type Props = {
  signals: Signal[];
  selectedId: string;
  onSelect: (id: string) => void;
  accountById: (id: string) => Account;
  sortMode: SortMode;
};

export function SignalCards({ signals, selectedId, onSelect, accountById, sortMode }: Props) {
  const showDividers = sortMode === 'type';
  let prevType: string | null = null;

  return (
    <ul className="m-0 list-none p-0">
      {signals.map((s, i) => {
        const a = accountById(s.accountId);
        const active = s.id === selectedId;
        const tone = SIGNAL_TONE[s.type];
        const divider =
          showDividers && s.type !== prevType ? (
            <li
              key={`div-${s.type}`}
              className="grid border-b border-t"
              style={{
                gridTemplateColumns: '3px 1fr auto',
                background: 'var(--color-paper-tint)',
                borderColor: 'var(--color-rule-strong)',
              }}
            >
              <span style={{ background: tone }} />
              <span
                className="py-2.5 pl-3.5 text-[10px] font-semibold uppercase"
                style={{ letterSpacing: '0.16em', color: 'var(--color-ink)' }}
              >
                {s.type}
              </span>
              <span className="mono flex items-center px-3.5 text-[10.5px]" style={{ color: 'var(--color-ink-mute)' }}>
                {signals.filter((x) => x.type === s.type).length}
              </span>
            </li>
          ) : null;
        prevType = s.type;

        return (
          <li key={s.id}>
            {divider}
            <button
              onClick={() => onSelect(s.id)}
              className="relative grid w-full cursor-pointer border-b text-left transition-colors"
              style={{
                gridTemplateColumns: '26px 1fr',
                gap: 12,
                padding: '14px 18px 14px 14px',
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
                style={{ color: active ? 'var(--color-ink-soft)' : 'var(--color-ink-faint)' }}
              >
                {String(i + 1).padStart(2, '0')}
              </span>
              <div>
                <div className="mb-1.5 flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: tone }} />
                    <span className="text-[11px] font-medium" style={{ color: 'var(--color-ink-soft)', letterSpacing: '-0.005em' }}>
                      {s.type}
                    </span>
                  </span>
                  <span className="mono ml-auto text-[10px]" style={{ color: 'var(--color-ink-faint)' }}>
                    {s.detectedAt}
                  </span>
                </div>
                <div className="serif text-[17px] font-medium leading-tight" style={{ letterSpacing: '-0.018em' }}>
                  {a.name}
                </div>
                <div className="mono mt-1 text-[10.5px]" style={{ color: 'var(--color-ink-mute)' }}>
                  {fmtMoneyFull(a.arr)} &middot; {a.plan} &middot; {a.owner}
                </div>
                <div
                  className="mt-[7px] text-[12.5px] leading-[1.42]"
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
                <div className="mt-2.5 flex items-center gap-2">
                  <span
                    className="rounded-sm px-[7px] py-[2px] text-[9px] font-semibold uppercase"
                    style={{
                      letterSpacing: '0.12em',
                      color:
                        s.urgency === 'high'
                          ? 'var(--color-risk)'
                          : s.urgency === 'medium'
                            ? 'var(--color-cc-accent)'
                            : 'var(--color-ink-mute)',
                      background:
                        s.urgency === 'high'
                          ? 'var(--color-risk-soft)'
                          : s.urgency === 'medium'
                            ? 'var(--color-cc-accent-soft)'
                            : 'var(--color-paper-deep)',
                    }}
                  >
                    {s.urgency}
                  </span>
                  <span className="mono text-[10.5px]" style={{ color: 'var(--color-ink-mute)' }}>
                    {s.conversationIds.length} sources
                  </span>
                  {active && (
                    <span className="mono ml-auto text-[10px] font-semibold" style={{ letterSpacing: '0.04em' }}>
                      ▸ OPEN
                    </span>
                  )}
                </div>
              </div>
            </button>
          </li>
        );
      })}
    </ul>
  );
}

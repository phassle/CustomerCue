'use client';

import type { Signal, Account } from '@/lib/signals/types';
import { SIGNAL_TONE } from '@/lib/signals/types';
import { fmtMoney, type SortMode } from '@/lib/signals/sort';

type Props = {
  signals: Signal[];
  selectedId: string;
  onSelect: (id: string) => void;
  accountById: (id: string) => Account;
  sortMode: SortMode;
};

function shortTime(s: string): string {
  if (!s) return '';
  if (s === 'yesterday') return '1d';
  const m = s.match(/(\d+)\s*(day|week|month|hour)/i);
  if (m) return m[1] + m[2][0].toLowerCase();
  return s;
}

export function SignalLedger({ signals, selectedId, onSelect, accountById, sortMode }: Props) {
  const showDividers = sortMode === 'type';
  let prevType: string | null = null;

  return (
    <ul className="m-0 list-none p-0">
      {signals.map((s, i) => {
        const a = accountById(s.accountId);
        const active = s.id === selectedId;
        const tone = SIGNAL_TONE[s.type];
        const uLetter = s.urgency === 'high' ? 'H' : s.urgency === 'medium' ? 'M' : 'L';
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
                className="py-1.5 pl-3.5 text-[9.5px] font-semibold uppercase"
                style={{ letterSpacing: '0.18em', color: 'var(--color-ink)' }}
              >
                {s.type}
              </span>
              <span className="mono flex items-center px-3.5 text-[10px]" style={{ color: 'var(--color-ink-mute)' }}>
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
              className="relative grid w-full cursor-pointer items-center border-b text-left transition-colors"
              style={{
                gridTemplateColumns: '22px 6px minmax(0, 1fr) auto 18px 32px',
                gap: 10,
                padding: '8px 16px 8px 12px',
                borderColor: 'var(--color-rule)',
                background: active ? 'var(--color-paper)' : 'transparent',
              }}
              title={`${s.type} · ${s.summary}`}
              data-signal-id={s.id}
            >
              {active && (
                <span className="absolute bottom-0 left-0 top-0 w-[3px]" style={{ background: tone }} />
              )}
              <span className="text-right text-[10.5px] font-medium" style={{ color: active ? 'var(--color-ink-soft)' : 'var(--color-ink-faint)' }}>
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className="h-1.5 w-1.5 justify-self-center rounded-full" style={{ background: tone }} aria-label={s.type} />
              <span
                className="serif overflow-hidden text-ellipsis whitespace-nowrap text-[14.5px] font-medium"
                style={{ letterSpacing: '-0.015em' }}
              >
                {a.name}
              </span>
              <span className="text-right text-[11px] font-semibold" style={{ color: 'var(--color-ink-soft)', letterSpacing: '0.01em' }}>
                {fmtMoney(a.arr)}
              </span>
              <span
                className="grid h-4 w-[18px] place-items-center rounded-sm text-[9.5px] font-bold"
                style={{
                  background: s.urgency === 'high' ? 'var(--color-risk)' : s.urgency === 'medium' ? 'var(--color-cc-accent)' : 'var(--color-paper-deep)',
                  color: s.urgency === 'low' ? 'var(--color-ink-mute)' : 'var(--color-paper)',
                }}
                aria-label={`${s.urgency} priority`}
              >
                {uLetter}
              </span>
              <span className="text-right text-[10px]" style={{ color: 'var(--color-ink-mute)' }}>
                {shortTime(s.detectedAt)}
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}

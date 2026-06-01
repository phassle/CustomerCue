'use client';

import { useState, useRef, useEffect } from 'react';
import { type SortMode, SORT_MODES } from '@/lib/signals/sort';

type Props = {
  layout: 1 | 2 | 3;
  setLayout: (l: 1 | 2 | 3) => void;
  sortMode: SortMode;
  setSortMode: (m: SortMode) => void;
};

const LAYOUTS = [
  { n: 1 as const, label: 'Cards' },
  { n: 2 as const, label: 'Ledger' },
  { n: 3 as const, label: 'Grouped' },
];

export function QueueToolbar({ layout, setLayout, sortMode, setSortMode }: Props) {
  const [sortOpen, setSortOpen] = useState(false);
  const sortRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) {
        setSortOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const currentLabel = SORT_MODES.find((m) => m.key === sortMode)?.label ?? 'Priority';

  return (
    <div
      className="flex items-center gap-1 border-b px-3.5 py-2"
      style={{ borderColor: 'var(--color-rule)', background: 'var(--color-paper-tint)' }}
    >
      {/* Layout tabs */}
      <div
        className="inline-flex rounded border p-0.5"
        style={{ background: 'var(--color-surface)', borderColor: 'var(--color-rule-strong)' }}
        role="tablist"
        aria-label="Queue listing layout"
      >
        {LAYOUTS.map((l) => (
          <button
            key={l.n}
            onClick={() => setLayout(l.n)}
            className="inline-flex items-center gap-1.5 rounded-sm px-2.5 py-1 text-[11px] font-medium transition-colors"
            style={{
              background: layout === l.n ? 'var(--color-ink)' : 'transparent',
              color: layout === l.n ? 'var(--color-paper)' : 'var(--color-ink-soft)',
            }}
            role="tab"
            aria-selected={layout === l.n}
          >
            <span>{l.label}</span>
            <kbd
              className="text-[8.5px]"
              style={{
                background: layout === l.n ? 'rgba(247,243,236,.10)' : 'transparent',
                borderColor: layout === l.n ? 'rgba(247,243,236,.22)' : 'var(--color-rule-strong)',
                color: layout === l.n ? 'rgba(247,243,236,.72)' : 'var(--color-ink-faint)',
              }}
            >
              {l.n}
            </kbd>
          </button>
        ))}
      </div>

      {/* Sort dropdown */}
      <div className="relative ml-auto" ref={sortRef}>
        <button
          onClick={() => setSortOpen(!sortOpen)}
          className="inline-flex items-center gap-1.5 rounded px-2.5 py-1.5 text-[11px] font-medium transition-colors"
          style={{
            color: sortOpen ? 'var(--color-ink)' : 'var(--color-ink-soft)',
            background: sortOpen ? 'var(--color-surface)' : 'transparent',
            boxShadow: sortOpen ? 'inset 0 0 0 1px var(--color-ink)' : 'none',
          }}
          aria-label="Sort signals"
        >
          <span className="mono" style={{ color: 'var(--color-ink-mute)' }}>
            ↓
          </span>
          <span>{currentLabel}</span>
          <span className="text-[9px]" style={{ color: 'var(--color-ink-mute)' }}>
            ▾
          </span>
        </button>

        {sortOpen && (
          <div
            className="absolute right-0 top-full z-30 mt-1.5 min-w-[240px] rounded border p-1 shadow-lg"
            style={{ background: 'var(--color-surface)', borderColor: 'var(--color-ink)' }}
            role="menu"
          >
            <div
              className="px-2.5 pb-1 pt-2 text-[9.5px] font-semibold uppercase"
              style={{ color: 'var(--color-ink-mute)', letterSpacing: '0.16em' }}
            >
              Sort signals
            </div>
            {SORT_MODES.map((m) => (
              <button
                key={m.key}
                onClick={() => {
                  setSortMode(m.key);
                  setSortOpen(false);
                }}
                className="relative flex w-full flex-col items-start gap-0.5 rounded-sm px-2.5 py-2 text-left transition-colors"
                style={{ background: sortMode === m.key ? 'var(--color-paper)' : 'transparent' }}
                role="menuitemradio"
                aria-checked={sortMode === m.key}
              >
                {sortMode === m.key && (
                  <span
                    className="absolute bottom-2 left-0 top-2 w-0.5 rounded"
                    style={{ background: 'var(--color-ink)' }}
                  />
                )}
                <span className="text-[12.5px] font-medium" style={{ color: 'var(--color-ink)' }}>
                  {m.label}
                </span>
                <span className="text-[10.5px]" style={{ color: 'var(--color-ink-mute)' }}>
                  {m.desc}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

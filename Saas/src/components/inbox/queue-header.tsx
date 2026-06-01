'use client';

type Props = { count: number; highCount: number };

export function QueueHeader({ count, highCount }: Props) {
  return (
    <header className="border-b px-5 pb-3.5 pt-[18px]" style={{ borderColor: 'var(--color-rule)' }}>
      <div className="flex items-end justify-between gap-3">
        <div>
          <div
            className="text-[9.5px] font-semibold uppercase"
            style={{ letterSpacing: '0.16em', color: 'var(--color-ink-mute)' }}
          >
            Queue &middot; ARR-weighted
          </div>
          <h2
            className="serif mt-1 text-[26px] font-normal leading-none"
            style={{ letterSpacing: '-0.028em' }}
          >
            This week
          </h2>
        </div>
        <div className="mono flex items-center gap-2 text-[11px]" style={{ color: 'var(--color-ink-mute)' }}>
          <span>
            <strong className="mono text-xs font-semibold" style={{ color: 'var(--color-ink)' }}>
              {count}
            </strong>{' '}
            open
          </span>
          <span className="inline-block h-[3px] w-[3px] rounded-full" style={{ background: 'var(--color-ink-faint)' }} />
          <span>
            <strong className="mono text-xs font-semibold" style={{ color: 'var(--color-risk)' }}>
              {highCount}
            </strong>{' '}
            high
          </span>
        </div>
      </div>
    </header>
  );
}

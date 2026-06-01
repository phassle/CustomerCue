'use client';

type Props = { signalCount: number; highCount: number };

export function StatusFooter({ signalCount, highCount }: Props) {
  return (
    <footer
      className="mono flex shrink-0 items-center gap-3.5 px-5 text-[10.5px]"
      style={{ height: 30, background: 'var(--color-ink)', color: 'rgba(247,243,236,.72)', letterSpacing: '0.04em' }}
    >
      <span>1,284 conversations indexed &middot; 7-day window</span>
      <span className="inline-block h-[3px] w-[3px] rounded-full" style={{ background: 'rgba(247,243,236,.3)' }} />
      <span>{signalCount} open signals &middot; {highCount} high priority</span>
      <span className="inline-block h-[3px] w-[3px] rounded-full" style={{ background: 'rgba(247,243,236,.3)' }} />
      <span>Intercom &middot; Zendesk</span>
      <span className="inline-block h-[3px] w-[3px] rounded-full" style={{ background: 'rgba(247,243,236,.3)' }} />
      <span>classifier &middot; v0.4-mock &middot; 4m ago</span>
      <span className="flex-1" />
      <span className="text-[10px] font-semibold uppercase" style={{ color: 'var(--color-cc-accent)', letterSpacing: '0.08em' }}>
        demo build &middot; fictional data
      </span>
    </footer>
  );
}

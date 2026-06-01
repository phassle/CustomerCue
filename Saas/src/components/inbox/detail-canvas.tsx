'use client';

import type { Signal, Account, Conversation } from '@/lib/signals/types';
import { SIGNAL_TONE } from '@/lib/signals/types';
import { fmtMoney, fmtMoneyFull, ticketRef } from '@/lib/signals/sort';

type Props = {
  signal: Signal;
  account: Account;
  conversations: Conversation[];
  onAccountClick: () => void;
  onSend: () => void;
  onMarkHandled: () => void;
};

function sparklinePoints(sentiment: number): string {
  const seed = Math.abs(Math.round(sentiment * 137));
  const pts: string[] = [];
  for (let i = 0; i < 7; i++) {
    const noise = (((seed + i * 23) % 11) - 5) / 32;
    const drift = sentiment * (i / 6);
    const v = drift + noise;
    const x = (i / 6) * 70;
    const y = 11 - v * 14;
    pts.push(`${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`);
  }
  return pts.join(' ');
}

export function DetailCanvas({ signal, account, conversations, onAccountClick, onSend, onMarkHandled }: Props) {
  const tone = SIGNAL_TONE[signal.type];
  const sentimentColor = signal.sentiment < -0.2 ? 'var(--color-risk)' : signal.sentiment > 0.05 ? 'var(--color-expand)' : 'var(--color-ink)';
  const sparkColor = signal.sentiment < 0 ? '#8C2D2D' : '#2A5D3C';

  return (
    <article
      className="flex-1 overflow-y-auto"
      style={{
        background: 'var(--color-paper)',
        backgroundImage:
          'radial-gradient(ellipse at top right, rgba(255,255,255,0.6), transparent 50%), radial-gradient(ellipse at bottom left, rgba(184,137,60,0.035), transparent 60%)',
      }}
    >
      <div className="mx-auto max-w-[880px] px-14 pb-20 pt-9">
        {/* Breadcrumb */}
        <nav className="mono mb-6 flex items-center gap-2.5 text-[11px]" style={{ color: 'var(--color-ink-mute)', letterSpacing: '0.04em' }} aria-label="Breadcrumb">
          <span>SIGNALS</span>
          <span style={{ color: 'var(--color-ink-faint)' }}>/</span>
          <button onClick={onAccountClick} className="cursor-pointer hover:underline">
            {account.name.toUpperCase()}
          </button>
          <span style={{ color: 'var(--color-ink-faint)' }}>/</span>
          <span style={{ color: 'var(--color-ink)' }}>{signal.type.toUpperCase()}</span>
        </nav>

        {/* Headline row */}
        <div className="mb-[18px] flex flex-wrap items-center gap-2.5">
          <span
            className="inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-[11.5px] font-medium"
            style={{ background: 'var(--color-surface)', borderColor: 'var(--color-rule-strong)' }}
          >
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: tone }} />
            {signal.type}
          </span>
          <span
            className="rounded-sm px-[7px] py-[2px] text-[9px] font-semibold uppercase"
            style={{
              letterSpacing: '0.12em',
              color: signal.urgency === 'high' ? 'var(--color-risk)' : signal.urgency === 'medium' ? 'var(--color-cc-accent)' : 'var(--color-ink-mute)',
              background: signal.urgency === 'high' ? 'var(--color-risk-soft)' : signal.urgency === 'medium' ? 'var(--color-cc-accent-soft)' : 'var(--color-paper-deep)',
            }}
          >
            {signal.urgency} priority
          </span>
          <span className="mono text-[11px]" style={{ color: 'var(--color-ink-mute)' }}>
            detected {signal.detectedAt}
          </span>
          <span className="mono ml-1 text-[11px]" style={{ color: 'var(--color-ink-mute)' }}>
            confidence {(signal.confidence * 100).toFixed(0)}%
          </span>
        </div>

        {/* Account headline */}
        <h1
          className="serif m-0 leading-[0.94]"
          style={{
            fontSize: 'clamp(48px, 5.4vw, 76px)',
            fontWeight: 400,
            letterSpacing: '-0.042em',
            fontVariationSettings: "'opsz' 144, 'SOFT' 30",
          }}
        >
          <button onClick={onAccountClick} className="cursor-pointer hover:underline">
            {account.name}
          </button>
        </h1>

        {/* Meta strip */}
        <div className="mt-[18px] mb-8 flex flex-wrap items-baseline gap-[18px] text-[13px]">
          <span className="inline-flex items-baseline gap-2">
            <em className="text-[9.5px] font-semibold uppercase not-italic" style={{ letterSpacing: '0.14em', color: 'var(--color-ink-mute)' }}>
              ARR
            </em>
            <strong className="serif text-[15px] font-medium" style={{ letterSpacing: '-0.015em' }}>
              {fmtMoneyFull(account.arr)}
            </strong>
          </span>
          <span className="inline-block h-3 w-px self-center" style={{ background: 'var(--color-rule-strong)' }} />
          <span className="inline-flex items-baseline gap-2">
            <em className="text-[9.5px] font-semibold uppercase not-italic" style={{ letterSpacing: '0.14em', color: 'var(--color-ink-mute)' }}>
              Plan
            </em>
            {account.plan}
          </span>
          <span className="inline-block h-3 w-px self-center" style={{ background: 'var(--color-rule-strong)' }} />
          <span className="inline-flex items-baseline gap-2">
            <em className="text-[9.5px] font-semibold uppercase not-italic" style={{ letterSpacing: '0.14em', color: 'var(--color-ink-mute)' }}>
              Segment
            </em>
            {account.segment}
          </span>
          <span className="inline-block h-3 w-px self-center" style={{ background: 'var(--color-rule-strong)' }} />
          <span className="inline-flex items-baseline gap-2">
            <em className="text-[9.5px] font-semibold uppercase not-italic" style={{ letterSpacing: '0.14em', color: 'var(--color-ink-mute)' }}>
              Owner
            </em>
            {account.owner}
          </span>
        </div>

        {/* Pullquote — AI Rationale */}
        <blockquote className="mt-8 mb-1 border-l-2 py-3.5 pl-6" style={{ borderColor: 'var(--color-ink)' }}>
          <div
            className="mb-2 text-[9.5px] font-semibold uppercase"
            style={{ letterSpacing: '0.16em', color: 'var(--color-ink-mute)' }}
          >
            Why we flagged this
          </div>
          <p
            className="serif m-0 text-[22px] font-light leading-[1.42]"
            style={{ fontVariationSettings: "'opsz' 48, 'SOFT' 50", letterSpacing: '-0.018em' }}
          >
            {signal.rationale}
          </p>
        </blockquote>

        {/* Stats grid */}
        <div className="mt-9 mb-0 grid grid-cols-4 border-b border-t" style={{ borderColor: 'var(--color-ink)' }}>
          <div className="border-r p-[18px]" style={{ borderColor: 'var(--color-rule)', background: 'var(--color-paper-tint)' }}>
            <div className="text-[9.5px] font-semibold uppercase" style={{ letterSpacing: '0.14em', color: 'var(--color-ink-mute)' }}>
              Sentiment
            </div>
            <div className="mt-2.5 flex items-center gap-2.5">
              <div className="serif text-[34px] font-normal leading-none" style={{ letterSpacing: '-0.038em', fontVariationSettings: "'opsz' 96", color: sentimentColor }}>
                {signal.sentiment.toFixed(2)}
              </div>
              <svg className="h-[22px] w-[70px] shrink-0 opacity-90" viewBox="0 0 70 22" preserveAspectRatio="none" aria-hidden="true">
                <path d={sparklinePoints(signal.sentiment)} fill="none" stroke={sparkColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div className="mono mt-2 text-[10.5px]" style={{ color: 'var(--color-ink-mute)', letterSpacing: '0.02em' }}>
              trailing 14 days
            </div>
          </div>
          <div className="border-r p-[18px]" style={{ borderColor: 'var(--color-rule)', background: 'var(--color-paper-tint)' }}>
            <div className="text-[9.5px] font-semibold uppercase" style={{ letterSpacing: '0.14em', color: 'var(--color-ink-mute)' }}>
              Source tickets
            </div>
            <div className="serif mt-2.5 text-[34px] font-normal leading-none" style={{ letterSpacing: '-0.038em', fontVariationSettings: "'opsz' 96" }}>
              {signal.conversationIds.length}
            </div>
            <div className="mono mt-2 text-[10.5px]" style={{ color: 'var(--color-ink-mute)', letterSpacing: '0.02em' }}>
              linked evidence
            </div>
          </div>
          <div className="border-r p-[18px]" style={{ borderColor: 'var(--color-rule)', background: 'var(--color-paper-tint)' }}>
            <div className="text-[9.5px] font-semibold uppercase" style={{ letterSpacing: '0.14em', color: 'var(--color-ink-mute)' }}>
              Account ARR
            </div>
            <div className="serif mt-2.5 text-[34px] font-normal leading-none" style={{ letterSpacing: '-0.038em', fontVariationSettings: "'opsz' 96" }}>
              {fmtMoney(account.arr)}
            </div>
            <div className="mono mt-2 text-[10.5px]" style={{ color: 'var(--color-ink-mute)', letterSpacing: '0.02em' }}>
              {account.segment.toLowerCase()} segment
            </div>
          </div>
          <div className="p-[18px]" style={{ background: 'var(--color-risk-soft)' }}>
            <div className="text-[9.5px] font-semibold uppercase" style={{ letterSpacing: '0.14em', color: 'var(--color-risk)' }}>
              If this churns
            </div>
            <div className="serif mt-2.5 text-[34px] font-normal leading-none" style={{ letterSpacing: '-0.038em', fontVariationSettings: "'opsz' 96", color: 'var(--color-risk)' }}>
              −{fmtMoney(account.arr)}
            </div>
            <div className="mono mt-2 text-[10.5px]" style={{ color: 'var(--color-ink-mute)', letterSpacing: '0.02em' }}>
              annual recurring
            </div>
          </div>
        </div>

        {/* Source conversations */}
        <section className="mt-11">
          <header className="flex items-end justify-between gap-4 border-b-2 pb-3" style={{ borderColor: 'var(--color-ink)' }}>
            <div>
              <div className="text-[9.5px] font-semibold uppercase" style={{ letterSpacing: '0.16em', color: 'var(--color-ink-mute)' }}>
                Source conversations
              </div>
              <p className="serif mt-1 text-[12.5px] font-light italic" style={{ color: 'var(--color-ink-mute)', fontVariationSettings: "'opsz' 18" }}>
                Every signal links to its evidence. Trust contract from <span className="mono not-italic">docs/signals.md</span>.
              </p>
            </div>
          </header>
          <ol className="m-0 list-none p-0">
            {conversations.map((c) => (
              <li
                key={c.id}
                className="-mx-3 grid cursor-pointer border-b p-4 transition-colors hover:bg-white"
                style={{ gridTemplateColumns: '110px minmax(0, 1fr) 90px 20px', gap: 18, borderColor: 'var(--color-rule)' }}
              >
                <div className="flex flex-col gap-1 pt-0.5">
                  <span className="text-[9.5px] font-semibold uppercase" style={{ letterSpacing: '0.18em' }}>
                    {c.channel.toUpperCase()}
                  </span>
                  <span className="mono text-[10px]" style={{ color: 'var(--color-ink-faint)', letterSpacing: '0.02em' }}>
                    {ticketRef(c.channel, c.id)}
                  </span>
                </div>
                <div>
                  <div className="text-[14.5px] font-medium leading-[1.3]" style={{ letterSpacing: '-0.012em' }}>
                    {c.subject}
                  </div>
                  <div
                    className="mt-1.5 text-[12.5px] leading-[1.5]"
                    style={{
                      color: 'var(--color-ink-mute)',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {c.snippet}
                  </div>
                </div>
                <div className="mono pt-[3px] text-right text-[11px]" style={{ color: 'var(--color-ink-mute)' }}>
                  {c.date}
                </div>
                <span className="pt-0.5 text-[14px]" style={{ color: 'var(--color-ink-faint)' }}>
                  ↗
                </span>
              </li>
            ))}
          </ol>
        </section>

        {/* Actions */}
        <footer
          className="relative mt-11 border p-6"
          style={{ background: 'var(--color-surface)', borderColor: 'var(--color-ink)' }}
        >
          <span className="absolute -top-px -right-px -left-px h-1" style={{ background: 'var(--color-ink)' }} />
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <div className="text-[9.5px] font-semibold uppercase" style={{ letterSpacing: '0.16em', color: 'var(--color-ink-mute)' }}>
              Next action
            </div>
            <p className="serif m-0 text-[11.5px] font-light italic" style={{ color: 'var(--color-ink-mute)', fontVariationSettings: "'opsz' 18" }}>
              Routing is mocked. No external calls fire from this demo.
            </p>
          </div>
          <div className="mt-4 flex flex-wrap gap-1.5">
            <button
              onClick={onSend}
              className="inline-flex items-center gap-2.5 rounded-sm px-3.5 py-2.5 text-[12.5px] font-medium transition-colors"
              style={{ background: 'var(--color-ink)', color: 'var(--color-paper)' }}
            >
              Send to {account.owner.split(' ')[0]} via Slack
              <kbd style={{ background: 'rgba(247,243,236,.14)', borderColor: 'rgba(247,243,236,.22)', color: 'var(--color-paper)', borderBottomWidth: 1 }}>E</kbd>
            </button>
            <button
              className="inline-flex items-center gap-2.5 rounded-sm px-3.5 py-2.5 text-[12.5px] font-medium"
              style={{ background: 'var(--color-paper)', boxShadow: 'inset 0 0 0 1px var(--color-rule-strong)' }}
            >
              Create CSM task <kbd>T</kbd>
            </button>
            <button
              className="inline-flex items-center gap-2.5 rounded-sm px-3.5 py-2.5 text-[12.5px] font-medium"
              style={{ background: 'var(--color-paper)', boxShadow: 'inset 0 0 0 1px var(--color-rule-strong)' }}
            >
              Forward to Product <kbd>F</kbd>
            </button>
            <button
              onClick={onMarkHandled}
              className="ml-auto inline-flex items-center gap-2.5 rounded-sm px-3.5 py-2.5 text-[12.5px]"
              style={{ color: 'var(--color-ink-mute)' }}
            >
              Mark handled <kbd>X</kbd>
            </button>
          </div>
        </footer>
      </div>
    </article>
  );
}

'use client';

import { useState, useCallback, useEffect } from 'react';
import type { Signal, Account, Conversation, SeedUser } from '@/lib/signals/types';
import { SIGNAL_TONE } from '@/lib/signals/types';
import { applySort, type SortMode, SORT_MODES, fmtMoney, fmtMoneyFull, ticketRef } from '@/lib/signals/sort';
import { IconRail } from './icon-rail';
import { QueueHeader } from './queue-header';
import { QueueToolbar } from './queue-toolbar';
import { SignalCards } from './signal-cards';
import { SignalLedger } from './signal-ledger';
import { SignalGrouped } from './signal-grouped';
import { DetailCanvas } from './detail-canvas';
import { StatusFooter } from './status-footer';
import { SendToOwnerModal } from './send-to-owner-modal';
import { AccountDrilldown } from './account-drilldown';

type Props = {
  signals: Signal[];
  accounts: Account[];
  conversationMap: Record<string, Conversation>;
  user: SeedUser;
};

export function TriageInbox({ signals, accounts, conversationMap, user }: Props) {
  const [selectedId, setSelectedId] = useState(signals[0]?.id ?? '');
  const [sortMode, setSortMode] = useState<SortMode>('priority');
  const [layout, setLayout] = useState<1 | 2 | 3>(1);
  const [showSendModal, setShowSendModal] = useState(false);
  const [drilldownAccountId, setDrilldownAccountId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const sorted = applySort(signals, sortMode);
  const selected = sorted.find((s) => s.id === selectedId) ?? sorted[0];
  const account = accounts.find((a) => a.id === selected?.accountId);
  const highCount = sorted.filter((s) => s.urgency === 'high').length;

  const accountById = useCallback((id: string) => accounts.find((a) => a.id === id)!, [accounts]);

  useEffect(() => {
    if (toastMessage) {
      const t = setTimeout(() => setToastMessage(null), 3000);
      return () => clearTimeout(t);
    }
  }, [toastMessage]);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const tag = (e.target as HTMLElement)?.tagName?.toLowerCase();
      if (tag === 'input' || tag === 'textarea' || (e.target as HTMLElement)?.isContentEditable) return;

      if (e.key === '1' || e.key === '2' || e.key === '3') {
        setLayout(parseInt(e.key) as 1 | 2 | 3);
        return;
      }

      const idx = sorted.findIndex((s) => s.id === selectedId);

      if (e.key === 'j' || e.key === 'J') {
        if (idx < sorted.length - 1) setSelectedId(sorted[idx + 1].id);
      } else if (e.key === 'k' || e.key === 'K') {
        if (idx > 0) setSelectedId(sorted[idx - 1].id);
      } else if (e.key === 'e' || e.key === 'E') {
        setShowSendModal(true);
      } else if (e.key === 'x' || e.key === 'X') {
        handleMarkHandled();
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [sorted, selectedId]);

  async function handleMarkHandled() {
    await fetch('/api/action', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ signalId: selectedId, action: 'handled' }),
    });
    setToastMessage('Signal marked as handled');
  }

  async function handleSend(channel: 'slack' | 'email') {
    if (!account) return;
    await fetch('/api/action', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        signalId: selectedId,
        action: 'send',
        channel,
        recipient: account.owner,
      }),
    });
    setShowSendModal(false);
    setToastMessage(`Sent to ${account.owner.split(' ')[0]}`);
  }

  return (
    <div className="flex h-full flex-col" style={{ background: 'var(--color-paper)', color: 'var(--color-ink)' }}>
      {/* Top bar */}
      <header
        className="flex shrink-0 items-center gap-5 border-b px-6"
        style={{ height: 56, background: 'var(--color-surface)', borderColor: 'var(--color-rule)' }}
      >
        <div className="flex items-center gap-2.5">
          <span
            className="serif grid h-7 w-7 place-items-center rounded text-base font-semibold"
            style={{ background: 'var(--color-ink)', color: 'var(--color-paper)', letterSpacing: '-0.02em' }}
          >
            CC
          </span>
          <span className="serif text-[15.5px] font-medium" style={{ letterSpacing: '-0.018em' }}>
            CustomerCue
          </span>
          <span
            className="mono ml-1 border-l pl-3 text-[10.5px]"
            style={{ color: 'var(--color-ink-mute)', borderColor: 'var(--color-rule)', letterSpacing: '0.04em' }}
          >
            demo · prod
          </span>
        </div>
        <div className="flex-1" />
        <div className="flex items-center gap-3.5 text-[10.5px]" style={{ color: 'var(--color-ink-mute)' }}>
          <span className="flex items-center gap-1">
            <kbd>J</kbd><kbd>K</kbd> nav
          </span>
          <span className="flex items-center gap-1">
            <kbd>E</kbd> send
          </span>
          <span className="flex items-center gap-1">
            <kbd>X</kbd> handled
          </span>
        </div>
        <div className="mono flex items-center gap-1.5 text-[10.5px]" style={{ color: 'var(--color-ink-mute)' }}>
          <span className="h-1.5 w-1.5 rounded-full" style={{ background: 'var(--color-expand)', boxShadow: '0 0 0 2px var(--color-expand-soft)' }} />
          live · 4m ago
        </div>
        <div
          className="grid h-[30px] w-[30px] place-items-center rounded-full text-[10.5px] font-semibold"
          style={{ background: 'var(--color-ink)', color: 'var(--color-paper)', letterSpacing: '0.06em' }}
          title={user.name}
        >
          {user.initials}
        </div>
      </header>

      {/* Main grid */}
      <div className="flex min-h-0 flex-1">
        <IconRail />

        {/* Queue */}
        <section
          className="flex w-[380px] shrink-0 flex-col border-r"
          style={{ background: 'var(--color-surface)', borderColor: 'var(--color-rule)' }}
          aria-label="Signals queue"
        >
          <QueueHeader count={sorted.length} highCount={highCount} />
          <QueueToolbar layout={layout} setLayout={setLayout} sortMode={sortMode} setSortMode={setSortMode} />

          <div className="min-h-0 flex-1 overflow-y-auto">
            {layout === 1 && (
              <SignalCards
                signals={sorted}
                selectedId={selectedId}
                onSelect={setSelectedId}
                accountById={accountById}
                sortMode={sortMode}
              />
            )}
            {layout === 2 && (
              <SignalLedger
                signals={sorted}
                selectedId={selectedId}
                onSelect={setSelectedId}
                accountById={accountById}
                sortMode={sortMode}
              />
            )}
            {layout === 3 && (
              <SignalGrouped
                signals={sorted}
                selectedId={selectedId}
                onSelect={setSelectedId}
                accountById={accountById}
              />
            )}
          </div>
        </section>

        {/* Detail canvas */}
        {selected && account && (
          <DetailCanvas
            signal={selected}
            account={account}
            conversations={selected.conversationIds.map((id) => conversationMap[id]).filter(Boolean)}
            onAccountClick={() => setDrilldownAccountId(account.id)}
            onSend={() => setShowSendModal(true)}
            onMarkHandled={handleMarkHandled}
          />
        )}
      </div>

      {/* Status footer */}
      <StatusFooter signalCount={sorted.length} highCount={highCount} />

      {/* Send-to-owner modal */}
      {showSendModal && selected && account && (
        <SendToOwnerModal
          signal={selected}
          account={account}
          onSend={handleSend}
          onClose={() => setShowSendModal(false)}
        />
      )}

      {/* Account drilldown slide-in */}
      {drilldownAccountId && (
        <AccountDrilldown
          accountId={drilldownAccountId}
          accounts={accounts}
          signals={sorted}
          onClose={() => setDrilldownAccountId(null)}
        />
      )}

      {/* Toast */}
      {toastMessage && (
        <div
          className="fixed bottom-12 left-1/2 -translate-x-1/2 rounded-md px-4 py-2 text-sm font-medium shadow-lg"
          style={{ background: 'var(--color-ink)', color: 'var(--color-paper)' }}
        >
          {toastMessage}
        </div>
      )}
    </div>
  );
}

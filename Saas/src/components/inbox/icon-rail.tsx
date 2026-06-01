'use client';

import Link from 'next/link';

const NAV_ITEMS = [
  { icon: '◎', label: 'Signals', href: '/', active: true },
  { icon: '◵', label: 'Accounts', href: '#', active: false },
  { icon: '▤', label: 'Reports', href: '#', active: false },
  { icon: '⛁', label: 'Sources', href: '#', active: false },
  { icon: '⚙', label: 'Settings', href: '#', active: false },
];

export function IconRail() {
  return (
    <nav
      className="flex w-14 shrink-0 flex-col items-center gap-0.5 border-r py-3"
      style={{ background: 'var(--color-surface)', borderColor: 'var(--color-rule)' }}
      aria-label="Primary"
    >
      {NAV_ITEMS.map((item) => (
        <Link
          key={item.label}
          href={item.href}
          className="grid h-[38px] w-[38px] place-items-center rounded-md text-base transition-colors"
          style={{
            background: item.active ? 'var(--color-ink)' : 'transparent',
            color: item.active ? 'var(--color-paper)' : 'var(--color-ink-mute)',
          }}
          title={item.label}
          aria-label={item.label}
        >
          {item.icon}
        </Link>
      ))}
      <div className="flex-1" />
      <Link
        href="/classify"
        className="grid h-[38px] w-[38px] place-items-center rounded-md text-base transition-colors"
        style={{ color: 'var(--color-ink-mute)' }}
        title="Paste & Classify"
        aria-label="Paste & Classify"
      >
        +
      </Link>
    </nav>
  );
}

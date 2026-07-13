import type { Signal } from './types';
import { priorityScore, urgencyWeight } from './priority';
import { accounts } from '@/data/accounts';

export type SortMode = 'priority' | 'arr' | 'recent' | 'urgency' | 'type';

export const SORT_MODES: { key: SortMode; label: string; desc: string }[] = [
  { key: 'priority', label: 'Priority', desc: 'ARR × urgency' },
  { key: 'arr', label: 'ARR', desc: 'Largest accounts first' },
  { key: 'recent', label: 'Recent', desc: 'Newest signals first' },
  { key: 'urgency', label: 'Urgency', desc: 'High → low' },
  { key: 'type', label: 'Type', desc: 'Grouped by signal type' },
];

function accountById(id: string) {
  return accounts.find((a) => a.id === id)!;
}

const UNIT_TO_HOURS: Record<string, number> = {
  hour: 1,
  day: 24,
  week: 168,
  month: 720,
};

function recencyHours(s: Signal): number {
  const t = (s.detectedAt || '').toLowerCase();
  if (t === 'yesterday') return 24;
  const m = t.match(/(\d+)\s*(hour|day|week|month)/);
  if (!m) return 9999;
  return parseInt(m[1], 10) * (UNIT_TO_HOURS[m[2]] ?? 720);
}

function score(s: Signal): number {
  return priorityScore(accountById(s.accountId).arr, s.urgency);
}

export function applySort(list: Signal[], mode: SortMode): Signal[] {
  const copy = [...list];
  switch (mode) {
    case 'arr':
      copy.sort((a, b) => accountById(b.accountId).arr - accountById(a.accountId).arr || score(b) - score(a));
      break;
    case 'recent':
      copy.sort((a, b) => recencyHours(a) - recencyHours(b) || score(b) - score(a));
      break;
    case 'urgency':
      copy.sort((a, b) => urgencyWeight(b.urgency) - urgencyWeight(a.urgency) || score(b) - score(a));
      break;
    case 'type':
      copy.sort((a, b) => a.type.localeCompare(b.type) || score(b) - score(a));
      break;
    case 'priority':
    default:
      copy.sort((a, b) => score(b) - score(a));
  }
  return copy;
}

const CHANNEL_PREFIX: Record<string, string> = {
  intercom: 'IC',
  zendesk: 'ZD',
  email: 'EM',
};

export function ticketRef(channel: string, id: string): string {
  const num = String(id.replace(/^t/, '')).padStart(3, '0');
  const prefix = CHANNEL_PREFIX[channel] ?? 'PC';
  return `${prefix}·${num}`;
}

export function fmtMoney(n: number): string {
  if (n >= 10000) return '$' + (n / 1000).toFixed(0) + 'k';
  if (n >= 1000) return '$' + (n / 1000).toFixed(1) + 'k';
  return '$' + n;
}

export function fmtMoneyFull(n: number): string {
  return '$' + n.toLocaleString('en-US');
}

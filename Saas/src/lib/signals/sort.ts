import type { Signal, Urgency } from './types';
import { priorityScore } from './priority';
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

function urgencyRank(u: Urgency): number {
  return u === 'high' ? 3 : u === 'medium' ? 2 : 1;
}

function recencyHours(s: Signal): number {
  const t = (s.detectedAt || '').toLowerCase();
  if (t === 'yesterday') return 24;
  const m = t.match(/(\d+)\s*(hour|day|week|month)/);
  if (!m) return 9999;
  const n = parseInt(m[1], 10);
  const u = m[2];
  return n * (u === 'hour' ? 1 : u === 'day' ? 24 : u === 'week' ? 168 : 720);
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
      copy.sort((a, b) => urgencyRank(b.urgency) - urgencyRank(a.urgency) || score(b) - score(a));
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

export function ticketRef(channel: string, id: string): string {
  const num = String(id.replace(/^t/, '')).padStart(3, '0');
  const prefix = channel === 'intercom' ? 'IC' : channel === 'zendesk' ? 'ZD' : channel === 'email' ? 'EM' : 'PC';
  return `${prefix}·${num}`;
}

export function fmtMoney(n: number): string {
  if (n >= 1000) return '$' + (n >= 10000 ? (n / 1000).toFixed(0) : (n / 1000).toFixed(1)) + 'k';
  return '$' + n;
}

export function fmtMoneyFull(n: number): string {
  return '$' + n.toLocaleString('en-US');
}

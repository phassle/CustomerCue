import type { ActionedEntry, Signal } from '@/lib/signals/types';
import { signals as seedSignals } from '@/data/signals';

const store = new Map<string, Signal>();

function seed() {
  if (store.size > 0) return;
  for (const s of seedSignals) {
    store.set(s.id, { ...s });
  }
}

seed();

let pasteCounter = 0;

export function list(): Signal[] {
  return Array.from(store.values());
}

export function get(id: string): Signal | undefined {
  return store.get(id);
}

export function prepend(signal: Signal): void {
  const newStore = new Map<string, Signal>();
  newStore.set(signal.id, signal);
  for (const [k, v] of store) {
    newStore.set(k, v);
  }
  store.clear();
  for (const [k, v] of newStore) {
    store.set(k, v);
  }
}

export function appendActioned(id: string, entry: ActionedEntry): void {
  const signal = store.get(id);
  if (!signal) return;
  signal.actioned.push(entry);
}

export function markHandled(id: string): void {
  const signal = store.get(id);
  if (!signal) return;
  signal.handled = true;
}

export function nextPasteRef(): string {
  pasteCounter++;
  return `PC·${String(pasteCounter).padStart(3, '0')}`;
}

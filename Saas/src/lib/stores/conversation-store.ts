import type { Conversation } from '@/lib/signals/types';
import { conversations as seedConversations } from '@/data/conversations';

const store = new Map<string, Conversation>();

function seed() {
  if (store.size > 0) return;
  for (const c of seedConversations) {
    store.set(c.id, { ...c });
  }
}

seed();

export function get(id: string): Conversation | undefined {
  return store.get(id);
}

export function getMany(ids: string[]): Conversation[] {
  return ids.map((id) => store.get(id)).filter((c): c is Conversation => c !== undefined);
}

export function add(conversation: Conversation): void {
  store.set(conversation.id, conversation);
}

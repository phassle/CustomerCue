import { currentUser } from '@/lib/session';
import { list } from '@/lib/stores/signal-store';
import { getMany } from '@/lib/stores/conversation-store';
import { accounts } from '@/data/accounts';
import { TriageInbox } from '@/components/inbox/triage-inbox';

export const dynamic = 'force-dynamic';

export default async function InboxPage() {
  const user = await currentUser();
  const signals = list().filter((s) => !s.handled);
  const allConversationIds = signals.flatMap((s) => s.conversationIds);
  const conversations = getMany(allConversationIds);
  const conversationMap = Object.fromEntries(conversations.map((c) => [c.id, c]));

  return (
    <TriageInbox
      signals={signals}
      accounts={accounts}
      conversationMap={conversationMap}
      user={user}
    />
  );
}

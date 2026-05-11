import type { Conversation, Message } from "../data/conversation-fixtures/types";

function MessageBubble({ message }: { message: Message }) {
  const alignment =
    message.author === "customer"
      ? "border-foreground/15 bg-foreground/5 self-start"
      : "border-accent/20 bg-accent/5 self-end";

  return (
    <article
      aria-label={`Message from ${message.authorName}`}
      class={`rounded-lg border px-4 py-3 ${alignment}`}
    >
      <div class="mb-1 flex items-baseline gap-2">
        <span class="font-display text-sm font-semibold text-foreground">
          {message.authorName}
        </span>
        <span class="font-mono text-xs text-muted">{message.timestamp}</span>
      </div>
      <p class="font-body text-sm leading-relaxed text-foreground/90">
        {message.body}
      </p>
    </article>
  );
}

export function ConversationThread({
  conversation,
}: {
  conversation: Conversation;
}) {
  return (
    <div class="mx-auto max-w-2xl">
      <header class="mb-4 rounded-lg border border-foreground/10 bg-foreground/5 px-4 py-3">
        <h3 class="font-display text-base font-semibold text-foreground">
          {conversation.scenarioLabel}
        </h3>
        <dl class="mt-1 flex flex-wrap gap-x-4 gap-y-1 font-mono text-xs text-muted">
          <div class="flex gap-1">
            <dt>Account:</dt>
            <dd class="text-foreground/80">{conversation.account}</dd>
          </div>
          <div class="flex gap-1">
            <dt>Context:</dt>
            <dd class="text-foreground/80">{conversation.productContext}</dd>
          </div>
        </dl>
      </header>

      <div class="flex flex-col gap-3">
        {conversation.messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}
      </div>
    </div>
  );
}

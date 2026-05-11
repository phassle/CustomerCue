import type {
  Conversation,
  Message,
  Annotation,
} from "../data/conversation-fixtures/types";
import type { SignalType } from "../lib/signal-catalog";


/*
 * Four-hue highlight palette derived from accent #D4763C.
 * Each signal type maps deterministically to one hue via hash.
 */
const HIGHLIGHT_PALETTE = [
  "rgba(212, 118, 60, 0.25)",
  "rgba(60, 162, 212, 0.25)",
  "rgba(162, 212, 60, 0.25)",
  "rgba(212, 60, 162, 0.25)",
];

function signalColor(signalType: SignalType): string {
  let hash = 0;
  for (let i = 0; i < signalType.length; i++) {
    hash = (hash * 31 + signalType.charCodeAt(i)) | 0;
  }
  return HIGHLIGHT_PALETTE[Math.abs(hash) % HIGHLIGHT_PALETTE.length];
}

type Segment =
  | { type: "text"; text: string }
  | { type: "mark"; text: string; annotation: Annotation };

function buildSegments(
  body: string,
  annotations: Annotation[],
): Segment[] {
  if (annotations.length === 0) return [{ type: "text", text: body }];

  const sorted = [...annotations].sort(
    (a, b) => a.range.start - b.range.start,
  );

  const segments: Segment[] = [];
  let cursor = 0;

  for (const ann of sorted) {
    if (ann.range.start > cursor) {
      segments.push({ type: "text", text: body.slice(cursor, ann.range.start) });
    }
    segments.push({
      type: "mark",
      text: body.slice(ann.range.start, ann.range.end),
      annotation: ann,
    });
    cursor = ann.range.end;
  }

  if (cursor < body.length) {
    segments.push({ type: "text", text: body.slice(cursor) });
  }

  return segments;
}

function AnnotatedBody({
  body,
  annotations,
}: {
  body: string;
  annotations: Annotation[];
}) {
  const segments = buildSegments(body, annotations);

  return (
    <p class="font-body text-sm leading-relaxed text-foreground/90">
      {segments.map((seg) =>
        seg.type === "text" ? (
          seg.text
        ) : (
          <mark
            key={seg.annotation.id}
            data-annotation-id={seg.annotation.id}
            data-signal-type={seg.annotation.signalType}
            aria-label={`highlight: ${seg.annotation.signalType}`}
            style={{ backgroundColor: signalColor(seg.annotation.signalType) }}
          >
            {seg.text}
          </mark>
        ),
      )}
    </p>
  );
}

function MessageBubble({
  message,
  annotations,
}: {
  message: Message;
  annotations: Annotation[];
}) {
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
      <AnnotatedBody body={message.body} annotations={annotations} />
    </article>
  );
}

export function ConversationThread({
  conversation,
}: {
  conversation: Conversation;
}) {
  const annotationsByMessage = new Map<string, Annotation[]>();
  for (const ann of conversation.annotations) {
    const list = annotationsByMessage.get(ann.range.messageId) ?? [];
    list.push(ann);
    annotationsByMessage.set(ann.range.messageId, list);
  }

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
          <MessageBubble
            key={msg.id}
            message={msg}
            annotations={annotationsByMessage.get(msg.id) ?? []}
          />
        ))}
      </div>
    </div>
  );
}

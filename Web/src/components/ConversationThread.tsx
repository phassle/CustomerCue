import type {
  Conversation,
  Message,
  Annotation,
} from "../data/conversation-fixtures/types";
import type { SignalType } from "../lib/signal-catalog";
import { signalColor } from "../lib/signal-colors";

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
    // Clamp overlapping ranges to the prior segment's end so the
    // first-sorted annotation wins and later ones contribute only their
    // non-overlapping tail. A range entirely behind the cursor is dropped.
    const start = Math.max(cursor, ann.range.start);
    if (start >= ann.range.end) continue;

    if (start > cursor) {
      segments.push({ type: "text", text: body.slice(cursor, start) });
    }
    segments.push({
      type: "mark",
      text: body.slice(start, ann.range.end),
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
  onAnnotationClick,
  hiddenSignalTypes,
}: {
  body: string;
  annotations: Annotation[];
  onAnnotationClick?: (annotation: Annotation) => void;
  hiddenSignalTypes?: Set<SignalType>;
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
            tabindex={0}
            data-annotation-id={seg.annotation.id}
            data-signal-type={seg.annotation.signalType}
            aria-label={`highlight: ${seg.annotation.signalType}`}
            hidden={hiddenSignalTypes?.has(seg.annotation.signalType) ?? false}
            class="rounded-sm text-inherit outline-none focus:ring-2 focus:ring-accent"
            style={{
              backgroundColor: signalColor(seg.annotation.signalType),
              cursor: onAnnotationClick ? "pointer" : undefined,
            }}
            onClick={
              onAnnotationClick
                ? () => onAnnotationClick(seg.annotation)
                : undefined
            }
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
  onAnnotationClick,
  hiddenSignalTypes,
}: {
  message: Message;
  annotations: Annotation[];
  onAnnotationClick?: (annotation: Annotation) => void;
  hiddenSignalTypes?: Set<SignalType>;
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
        <span class="font-mono text-xs text-foreground/60">{message.timestamp}</span>
      </div>
      <AnnotatedBody
        body={message.body}
        annotations={annotations}
        onAnnotationClick={onAnnotationClick}
        hiddenSignalTypes={hiddenSignalTypes}
      />
    </article>
  );
}

export function ConversationThread({
  conversation,
  onAnnotationClick,
  hiddenSignalTypes,
}: {
  conversation: Conversation;
  onAnnotationClick?: (annotation: Annotation) => void;
  hiddenSignalTypes?: Set<SignalType>;
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
            onAnnotationClick={onAnnotationClick}
            hiddenSignalTypes={hiddenSignalTypes}
          />
        ))}
      </div>
    </div>
  );
}

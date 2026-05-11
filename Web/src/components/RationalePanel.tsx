import type { JSX } from "preact";
import type { Annotation } from "../data/conversation-fixtures/types";
import { signalColor } from "../lib/signal-colors";

export function RationalePanel({
  annotation,
  onClose,
}: {
  annotation: Annotation;
  onClose: () => void;
}) {
  const handleKeyDown = (e: JSX.TargetedKeyboardEvent<HTMLElement>) => {
    if (e.key === "Escape") onClose();
  };

  return (
    <section
      aria-labelledby="rationale-heading"
      role="region"
      class="mt-4 rounded-lg border border-foreground/15 bg-foreground/5 px-4 py-4 md:mt-0 md:w-80 md:self-start md:sticky md:top-4"
      onKeyDown={handleKeyDown}
    >
      <div class="mb-3 flex items-center justify-between">
        <h4
          id="rationale-heading"
          class="font-display text-sm font-bold tracking-wide"
          style={{ color: signalColor(annotation.signalType) }}
        >
          {annotation.signalType.toUpperCase()}
        </h4>
        <button
          aria-label="Close rationale"
          class="rounded p-1 text-muted hover:text-foreground"
          onClick={onClose}
        >
          &times;
        </button>
      </div>
      <p class="font-body text-sm leading-relaxed text-foreground/80">
        {annotation.rationale}
      </p>
    </section>
  );
}

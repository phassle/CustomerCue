import { useState, useMemo, useRef } from "preact/hooks";
import { acmeIntegration } from "../data/conversation-fixtures/acme-integration";
import { nordicpayEnterprise } from "../data/conversation-fixtures/nordicpay-enterprise";
import { step3Onboarding } from "../data/conversation-fixtures/step3-onboarding";
import { csvWorkaround } from "../data/conversation-fixtures/csv-workaround";
import type { Annotation } from "../data/conversation-fixtures/types";
import { SIGNAL_NAMES, type SignalType } from "../lib/signal-catalog";
import { ScenarioPicker } from "./ScenarioPicker";
import { ConversationThread } from "./ConversationThread";
import { SignalTypeFilter } from "./SignalTypeFilter";

const CONFIDENCE_DOTS: Record<Annotation["confidence"], string> = {
  low: "●○○",
  medium: "●●○",
  high: "●●●",
};

function ConfidenceIndicator({ level }: { level: Annotation["confidence"] }) {
  return (
    <span class="mt-1 inline-block text-sm" role="img" aria-label={`confidence: ${level}`}>
      <span aria-hidden="true">{CONFIDENCE_DOTS[level]}</span>
    </span>
  );
}

const scenarios = [
  acmeIntegration,
  nordicpayEnterprise,
  step3Onboarding,
  csvWorkaround,
];

const SIGNAL_NAME_ORDER = new Map(SIGNAL_NAMES.map((name, i) => [name, i]));

function getVisibleMarks(container: HTMLElement): HTMLElement[] {
  const marks = container.querySelectorAll<HTMLElement>(
    "mark[data-annotation-id]",
  );
  return Array.from(marks).filter((m) => !m.hidden);
}

export function ConversationExplainer() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [rationaleAnnotationId, setRationaleAnnotationId] = useState<
    string | null
  >(null);
  const [hiddenSignalTypes, setHiddenSignalTypes] = useState<Set<SignalType>>(new Set());
  const containerRef = useRef<HTMLElement>(null);

  const conversation = scenarios[activeIndex];

  const activeAnnotation = rationaleAnnotationId
    ? conversation.annotations.find(
        (a) => a.id === rationaleAnnotationId,
      )
    : null;

  const activeSignalTypes = useMemo(() => {
    const types = [...new Set(conversation.annotations.map((a) => a.signalType))];
    return types.sort((a, b) => (SIGNAL_NAME_ORDER.get(a) ?? 0) - (SIGNAL_NAME_ORDER.get(b) ?? 0));
  }, [conversation]);

  function handleScenarioChange(index: number) {
    setActiveIndex(index);
    setRationaleAnnotationId(null);
    setHiddenSignalTypes(new Set());
  }

  function handleToggle(signalType: SignalType) {
    setHiddenSignalTypes((prev) => {
      const next = new Set(prev);
      if (next.has(signalType)) {
        next.delete(signalType);
      } else {
        next.add(signalType);
      }
      return next;
    });
  }

  function handleKeyDown(e: KeyboardEvent) {
    const container = containerRef.current;
    if (!container) return;

    switch (e.key) {
      case "j":
      case "k": {
        e.preventDefault();
        const marks = getVisibleMarks(container);
        if (marks.length === 0) return;

        const currentIndex = marks.indexOf(
          document.activeElement as HTMLElement,
        );

        let nextIndex: number;
        if (e.key === "j") {
          nextIndex =
            currentIndex === -1 ? 0 : (currentIndex + 1) % marks.length;
        } else {
          nextIndex =
            currentIndex === -1
              ? marks.length - 1
              : (currentIndex - 1 + marks.length) % marks.length;
        }

        marks[nextIndex].focus();
        break;
      }

      case "Enter": {
        const active = document.activeElement as HTMLElement;
        if (active?.hasAttribute("data-annotation-id")) {
          e.preventDefault();
          setRationaleAnnotationId(
            active.getAttribute("data-annotation-id"),
          );
        }
        break;
      }

      case "Escape": {
        if (rationaleAnnotationId) {
          e.preventDefault();
          const mark = container.querySelector<HTMLElement>(
            `mark[data-annotation-id="${rationaleAnnotationId}"]`,
          );
          setRationaleAnnotationId(null);
          // If the opening mark is hidden (e.g. its signal type was filtered
          // out while the panel was open), focusing it would silently fail.
          // Fall back to the first visible mark, then the container.
          if (mark && !mark.hidden) {
            mark.focus();
          } else {
            const visible = getVisibleMarks(container);
            (visible[0] ?? container).focus();
          }
        }
        break;
      }
    }
  }

  return (
    <section
      ref={containerRef}
      tabindex={-1}
      aria-label="Signal explainer"
      class="mx-auto max-w-5xl px-6 py-24 outline-none md:px-10"
      onKeyDown={handleKeyDown}
    >
      <h2 class="mb-4 font-display text-2xl font-bold md:text-3xl">
        Watch a support conversation become a signal.
      </h2>
      <p class="mb-12 max-w-2xl text-muted">
        Click any highlight to see the rationale. Switch scenarios to see four
        signal types in action.
      </p>
      <ScenarioPicker
        scenarios={scenarios}
        activeIndex={activeIndex}
        onSelect={handleScenarioChange}
      />
      <div class="mt-4">
        <SignalTypeFilter
          activeSignalTypes={activeSignalTypes}
          hiddenSignalTypes={hiddenSignalTypes}
          onToggle={handleToggle}
        />
      </div>
      <div class="mt-6">
        <ConversationThread
          conversation={conversation}
          onAnnotationClick={(ann) => setRationaleAnnotationId(ann.id)}
          hiddenSignalTypes={hiddenSignalTypes}
        />
      </div>

      {activeAnnotation && (
        <aside
          data-testid="rationale-panel"
          class="mt-4 rounded-lg border border-accent/30 bg-accent/5 px-4 py-3"
        >
          <h4 class="font-display text-sm font-semibold capitalize text-accent">
            {activeAnnotation.signalType}
          </h4>
          <ConfidenceIndicator level={activeAnnotation.confidence} />
          <p class="mt-2 font-body text-sm leading-relaxed text-foreground/90">
            {activeAnnotation.rationale}
          </p>
          <div class="mt-3 rounded border border-accent/20 bg-accent/5 px-3 py-2">
            <span class="font-mono text-xs font-semibold uppercase tracking-wide text-accent">
              Suggested action
            </span>
            <p class="mt-1 font-body text-sm leading-relaxed text-foreground/80">
              {activeAnnotation.suggestedAction}
            </p>
          </div>
        </aside>
      )}
    </section>
  );
}

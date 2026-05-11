import { useState, useRef } from "preact/hooks";
import type { JSX } from "preact";
import { acmeIntegration } from "../data/conversation-fixtures/acme-integration";
import { nordicpayEnterprise } from "../data/conversation-fixtures/nordicpay-enterprise";
import { step3Onboarding } from "../data/conversation-fixtures/step3-onboarding";
import { csvWorkaround } from "../data/conversation-fixtures/csv-workaround";
import { ScenarioPicker } from "./ScenarioPicker";
import { ConversationThread } from "./ConversationThread";

const scenarios = [
  acmeIntegration,
  nordicpayEnterprise,
  step3Onboarding,
  csvWorkaround,
];

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
  const containerRef = useRef<HTMLElement>(null);

  const activeAnnotation = rationaleAnnotationId
    ? scenarios[activeIndex].annotations.find(
        (a) => a.id === rationaleAnnotationId,
      )
    : null;

  function handleScenarioChange(index: number) {
    setActiveIndex(index);
    setRationaleAnnotationId(null);
  }

  function handleKeyDown(e: JSX.TargetedKeyboardEvent<HTMLElement>) {
    const container = containerRef.current;
    if (!container) return;

    if (e.key === "j" || e.key === "k") {
      e.preventDefault();
      const marks = getVisibleMarks(container);
      if (marks.length === 0) return;

      const currentIndex = marks.indexOf(document.activeElement as HTMLElement);

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
    } else if (e.key === "Enter") {
      const active = document.activeElement as HTMLElement;
      if (active?.hasAttribute("data-annotation-id")) {
        e.preventDefault();
        setRationaleAnnotationId(
          active.getAttribute("data-annotation-id"),
        );
      }
    } else if (e.key === "Escape") {
      if (rationaleAnnotationId) {
        e.preventDefault();
        const mark = container.querySelector<HTMLElement>(
          `mark[data-annotation-id="${rationaleAnnotationId}"]`,
        );
        setRationaleAnnotationId(null);
        mark?.focus();
      }
    }
  }

  return (
    <section
      ref={containerRef}
      tabindex={-1}
      aria-label="Signal explainer"
      class="mx-auto max-w-4xl px-4 outline-none"
      onKeyDown={handleKeyDown}
    >
      <ScenarioPicker
        scenarios={scenarios}
        activeIndex={activeIndex}
        onSelect={handleScenarioChange}
      />
      <div class="mt-6">
        <ConversationThread conversation={scenarios[activeIndex]} />
      </div>

      {activeAnnotation && (
        <aside
          data-testid="rationale-panel"
          class="mt-4 rounded-lg border border-accent/30 bg-accent/5 px-4 py-3"
        >
          <h4 class="font-display text-sm font-semibold capitalize text-accent">
            {activeAnnotation.signalType}
          </h4>
          <p class="mt-1 font-body text-sm leading-relaxed text-foreground/90">
            {activeAnnotation.rationale}
          </p>
          <p class="mt-2 font-body text-sm leading-relaxed text-muted">
            {activeAnnotation.suggestedAction}
          </p>
        </aside>
      )}
    </section>
  );
}

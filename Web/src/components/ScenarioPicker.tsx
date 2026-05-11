import { useRef } from "preact/hooks";
import type { Conversation } from "../data/conversation-fixtures/types";

export function ScenarioPicker({
  scenarios,
  activeIndex,
  onSelect,
}: {
  scenarios: Conversation[];
  activeIndex: number;
  onSelect: (index: number) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  function handleKeyDown(e: KeyboardEvent, index: number) {
    let next: number | null = null;

    if (e.key === "ArrowRight") {
      next = (index + 1) % scenarios.length;
    } else if (e.key === "ArrowLeft") {
      next = (index - 1 + scenarios.length) % scenarios.length;
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onSelect(index);
      return;
    }

    if (next !== null) {
      e.preventDefault();
      const buttons = containerRef.current?.querySelectorAll("button");
      (buttons?.[next] as HTMLButtonElement)?.focus();
    }
  }

  return (
    <div ref={containerRef} class="flex flex-wrap gap-2" role="group" aria-label="Scenario picker">
      {scenarios.map((scenario, i) => (
        <button
          key={scenario.id}
          type="button"
          aria-pressed={i === activeIndex ? "true" : "false"}
          class={`rounded-full border px-3 py-1.5 font-display text-xs transition-colors ${
            i === activeIndex
              ? "border-accent bg-accent/20 text-accent"
              : "border-foreground/15 bg-foreground/5 text-muted hover:border-foreground/30 hover:text-foreground"
          }`}
          onClick={() => onSelect(i)}
          onKeyDown={(e) => handleKeyDown(e as unknown as KeyboardEvent, i)}
        >
          {scenario.scenarioLabel}
        </button>
      ))}
    </div>
  );
}

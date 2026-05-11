import { useState } from "preact/hooks";
import type { SignalType } from "../lib/signal-catalog";
import { signalColor } from "./ConversationThread";

export function SignalTypeFilter({
  activeSignalTypes,
  hiddenSignalTypes,
  onToggle,
}: {
  activeSignalTypes: SignalType[];
  hiddenSignalTypes: Set<SignalType>;
  onToggle: (signalType: SignalType) => void;
}) {
  const [announcement, setAnnouncement] = useState("");

  function handleClick(signalType: SignalType) {
    const wasHidden = hiddenSignalTypes.has(signalType);
    setAnnouncement(
      wasHidden
        ? `${signalType} annotations visible`
        : `${signalType} annotations hidden`,
    );
    onToggle(signalType);
  }

  return (
    <div>
      <div
        class="flex flex-wrap gap-2"
        role="group"
        aria-label="Signal type filter"
      >
        {activeSignalTypes.map((signalType) => {
          const isHidden = hiddenSignalTypes.has(signalType);
          return (
            <button
              key={signalType}
              type="button"
              aria-pressed={!isHidden ? "true" : "false"}
              class={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 font-display text-xs transition-colors ${
                !isHidden
                  ? "border-accent bg-accent/20 text-accent"
                  : "border-foreground/15 bg-foreground/5 text-muted hover:border-foreground/30 hover:text-foreground"
              }`}
              onClick={() => handleClick(signalType)}
            >
              <span
                class="inline-block h-2 w-2 rounded-full"
                style={{ backgroundColor: signalColor(signalType) }}
              />
              {signalType}
            </button>
          );
        })}
      </div>
      <div class="sr-only" aria-live="polite">
        {announcement}
      </div>
    </div>
  );
}

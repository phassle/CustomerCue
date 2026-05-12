import type { SignalType } from "./signal-catalog";

// Highlight tints are declared as @theme tokens in src/styles/global.css
// (--color-highlight-1..4). Each signal type maps deterministically to one
// of the four slots via a stable hash so the colour stays constant across
// renders for the same signal type.
const HIGHLIGHT_VARS = [
  "var(--color-highlight-1)",
  "var(--color-highlight-2)",
  "var(--color-highlight-3)",
  "var(--color-highlight-4)",
];

export function signalColor(signalType: SignalType): string {
  let hash = 0;
  for (let i = 0; i < signalType.length; i++) {
    hash = (hash * 31 + signalType.charCodeAt(i)) | 0;
  }
  return HIGHLIGHT_VARS[Math.abs(hash) % HIGHLIGHT_VARS.length];
}

import type { SignalType } from "./signal-catalog";

const HIGHLIGHT_PALETTE = [
  "rgba(212, 118, 60, 0.25)",
  "rgba(60, 162, 212, 0.25)",
  "rgba(162, 212, 60, 0.25)",
  "rgba(212, 60, 162, 0.25)",
];

export function signalColor(signalType: SignalType): string {
  let hash = 0;
  for (let i = 0; i < signalType.length; i++) {
    hash = (hash * 31 + signalType.charCodeAt(i)) | 0;
  }
  return HIGHLIGHT_PALETTE[Math.abs(hash) % HIGHLIGHT_PALETTE.length];
}

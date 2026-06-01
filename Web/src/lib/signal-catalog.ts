export const SIGNAL_NAMES = [
  "churn risk",
  "expansion intent",
  "product friction",
  "bug cluster",
  "onboarding issue",
  "feature request",
  "negative sentiment",
  "strategic account escalation",
  "documentation gap",
  "repeated manual workaround",
] as const;

export type SignalType = (typeof SIGNAL_NAMES)[number];

/** Canonical URL slug for a signal type (spaces → hyphens). */
export const toSlug = (name: SignalType): string => name.replace(/\s+/g, "-");

export interface Signal {
  name: SignalType;
}

export function getAllSignals(): Signal[] {
  return SIGNAL_NAMES.map((name) => ({ name }));
}

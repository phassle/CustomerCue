export const signalCatalog = [
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

export type SignalType = (typeof signalCatalog)[number];

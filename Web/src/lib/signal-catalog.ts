export interface Signal {
  name: string;
}

const SIGNALS: Signal[] = [
  { name: "churn risk" },
  { name: "expansion intent" },
  { name: "product friction" },
  { name: "bug cluster" },
  { name: "onboarding issue" },
  { name: "feature request" },
  { name: "negative sentiment" },
  { name: "strategic account escalation" },
  { name: "documentation gap" },
  { name: "repeated manual workaround" },
];

export function getAllSignals(): Signal[] {
  return [...SIGNALS];
}

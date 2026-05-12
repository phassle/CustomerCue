import type { SignalType } from "../../lib/signal-catalog";

export type AnnotationRange = {
  messageId: string;
  start: number;
  end: number;
};

export interface Annotation {
  id: string;
  range: AnnotationRange;
  signalType: SignalType;
  confidence: "low" | "medium" | "high";
  rationale: string;
  suggestedAction: string;
}

export interface Message {
  id: string;
  author: "customer" | "agent";
  authorName: string;
  timestamp: string;
  body: string;
}

export interface Conversation {
  id: string;
  scenarioLabel: string;
  account: string;
  productContext: string;
  messages: Message[];
  annotations: Annotation[];
}

export const SIGNAL_TYPES = [
  'churn risk',
  'expansion intent',
  'product friction',
  'bug cluster',
  'onboarding issue',
  'feature request',
  'negative sentiment',
  'strategic account escalation',
  'documentation gap',
  'repeated manual workaround',
] as const;

export type SignalType = (typeof SIGNAL_TYPES)[number];

export function isSignalType(value: string): value is SignalType {
  return (SIGNAL_TYPES as readonly string[]).includes(value);
}

export function parseSignalType(value: string): SignalType {
  if (isSignalType(value)) return value;
  throw new Error(`Invalid signal type: "${value}"`);
}

export type Urgency = 'high' | 'medium' | 'low';

export type Classification = {
  signalType: SignalType;
  urgency: Urgency;
  rationale: string;
  confidence: number;
};

export type Channel = 'intercom' | 'zendesk' | 'email' | 'other';

export type Conversation = {
  id: string;
  channel: Channel;
  subject: string;
  snippet: string;
  body: string;
  date: string;
};

export type Account = {
  id: string;
  name: string;
  arr: number;
  plan: 'Starter' | 'Growth' | 'Enterprise';
  segment: 'SMB' | 'Mid-market' | 'Enterprise';
  owner: string;
};

export type ActionedEntry = {
  action: string;
  timestamp: string;
  channel: 'slack' | 'email';
  recipient: string;
};

export type Signal = {
  id: string;
  type: SignalType;
  accountId: string;
  summary: string;
  rationale: string;
  sentiment: number;
  urgency: Urgency;
  confidence: number;
  detectedAt: string;
  conversationIds: string[];
  actioned: ActionedEntry[];
  handled: boolean;
};

export type SeedUser = {
  id: string;
  name: string;
  role: string;
  initials: string;
};

export const SIGNAL_TONE: Record<SignalType, string> = {
  'churn risk': '#8C2D2D',
  'expansion intent': '#2A5D3C',
  'product friction': '#B8893C',
  'bug cluster': '#C25A1F',
  'onboarding issue': '#2D5C8C',
  'feature request': '#5A3C8C',
  'negative sentiment': '#8C2D5C',
  'strategic account escalation': '#A02020',
  'documentation gap': '#4A453E',
  'repeated manual workaround': '#2D7C7C',
};

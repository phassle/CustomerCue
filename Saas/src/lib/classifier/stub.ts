import { type Classification, type SignalType, SIGNAL_TYPES } from '@/lib/signals/types';

const KEYWORD_RULES: { type: SignalType; keywords: string[] }[] = [
  { type: 'churn risk', keywords: ['cancel', 'churn', 'leave', 'alternative', 'competitor', 'renewal risk', 'not renewing', 'pause', 'downgrade'] },
  { type: 'expansion intent', keywords: ['upgrade', 'expand', 'more seats', 'enterprise', 'sso', 'saml', 'scim', 'audit log', 'pricing', 'additional'] },
  { type: 'product friction', keywords: ['timeout', 'slow', 'frustrat', 'unusable', 'clunky', 'confusing ui', 'kicks me out'] },
  { type: 'bug cluster', keywords: ['bug', 'error', 'crash', 'broken', 'drops rows', 'missing data', 'nan', 'fails', 'reproducible'] },
  { type: 'onboarding issue', keywords: ['onboarding', 'setup', 'getting started', 'wizard', 'step 3', 'stuck', 'cannot get past', 'first time'] },
  { type: 'feature request', keywords: ['feature request', 'would love', 'can you add', 'roadmap', 'wish', 'requesting', 'need support for'] },
  { type: 'negative sentiment', keywords: ['disappointed', 'unhappy', 'poor', 'terrible', 'worst', 'angry', 'unacceptable', 'curt'] },
  { type: 'strategic account escalation', keywords: ['ciso', 'cto', 'ceo', 'escalat', 'executive', 'legal', 'compliance', 'security review'] },
  { type: 'documentation gap', keywords: ['documentation', 'docs', 'not documented', 'where is', 'cannot find', 'unclear', 'undocumented'] },
  { type: 'repeated manual workaround', keywords: ['manual', 'workaround', 'export', 'csv hack', 'bulk', 'every week', 'painful', 'tedious'] },
];

export function stubClassify(text: string): Classification {
  const lower = text.toLowerCase();

  for (const rule of KEYWORD_RULES) {
    if (rule.keywords.some((kw) => lower.includes(kw))) {
      return {
        signalType: rule.type,
        urgency: deriveUrgency(lower),
        rationale: `[stub] Matched keyword pattern for "${rule.type}".`,
        confidence: 0.6,
      };
    }
  }

  return {
    signalType: 'negative sentiment',
    urgency: 'low',
    rationale: '[stub] No keyword match — defaulting to negative sentiment.',
    confidence: 0.3,
  };
}

function deriveUrgency(text: string): 'high' | 'medium' | 'low' {
  const urgentKeywords = ['urgent', 'critical', 'blocker', 'escalat', 'immediately', 'asap', 'renewal', 'churn'];
  const mediumKeywords = ['important', 'soon', 'need', 'request', 'frustrated'];

  if (urgentKeywords.some((kw) => text.includes(kw))) return 'high';
  if (mediumKeywords.some((kw) => text.includes(kw))) return 'medium';
  return 'low';
}

export { SIGNAL_TYPES };

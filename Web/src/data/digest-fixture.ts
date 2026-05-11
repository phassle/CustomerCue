import type { SignalType } from "../lib/signal-catalog";

export interface SourceExcerpt {
  from: string;
  snippet: string;
}

export interface DigestEntry {
  signalType: SignalType;
  account: string;
  headline: string;
  supportingLines: string[];
  sourceConversationCount: number;
  sourceExcerpts: SourceExcerpt[];
  glyph: string;
  glyphLabel: string;
}

export interface WeeklyDigest {
  from: string;
  to: string;
  subject: string;
  weekLabel: string;
  fictionalBadge: string;
  entries: DigestEntry[];
}

export const digestFixture: WeeklyDigest = {
  from: "CustomerCue Signals <signals@customercue.ai>",
  to: "Jamie Torres, VP Customer Success",
  subject: "Your weekly revenue signals",
  weekLabel: "wk of May 11",
  fictionalBadge: "Fictional",
  entries: [
    {
      signalType: "churn risk",
      account: "Acme Corp",
      headline: "$42k ARR — 6 tickets in 14 days about the same integration issue",
      supportingLines: [
        "Sentiment is declining across the last four conversations.",
        "CSM should contact the customer before the renewal call.",
      ],
      sourceConversationCount: 6,
      sourceExcerpts: [
        {
          from: "Lin (Acme Corp)",
          snippet:
            "We've raised this three times now. The webhook still drops events when the payload exceeds 256 KB. Our team is losing confidence in the integration.",
        },
        {
          from: "Kai (Acme Corp)",
          snippet:
            "Is there a timeline on the fix? We're evaluating whether to keep this in our stack for next quarter.",
        },
      ],
      glyph: "⚠",
      glyphLabel: "warning",
    },
    {
      signalType: "expansion intent",
      account: "NordicPay",
      headline: "Repeated questions about SSO, audit logs, and admin roles",
      supportingLines: [
        "Three different contacts have asked about enterprise features in the last 10 days.",
        "This likely indicates enterprise expansion intent.",
      ],
      sourceConversationCount: 4,
      sourceExcerpts: [
        {
          from: "Astrid (NordicPay)",
          snippet:
            "We need SAML-based SSO before we can roll this out to the wider org. Is that on the roadmap?",
        },
        {
          from: "Erik (NordicPay)",
          snippet:
            "Our compliance team is asking about audit log retention. Can we export a full log for the last 12 months?",
        },
      ],
      glyph: "↗",
      glyphLabel: "trending up",
    },
    {
      signalType: "onboarding issue",
      account: "Step-3 onboarding cluster",
      headline: "37 tickets from 11 customers — 4 in target ICP",
      supportingLines: [
        "All relate to onboarding step 3.",
        "Product should prioritize this ahead of lower-value feature requests.",
      ],
      sourceConversationCount: 37,
      sourceExcerpts: [
        {
          from: "Sam (BrightLoop)",
          snippet:
            "We got stuck on step 3 for two days. The docs say to click 'Configure', but the button doesn't appear until you've added a second team member.",
        },
        {
          from: "Priya (Cobalt Health)",
          snippet:
            "Step 3 keeps timing out when we try to import more than 50 users. Had to split into batches of 10.",
        },
      ],
      glyph: "◷",
      glyphLabel: "clock",
    },
  ],
};

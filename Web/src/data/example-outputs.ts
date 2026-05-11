import type { SignalType } from "../lib/signal-catalog";

export interface ExampleOutput {
  id: string;
  accountName: string;
  narrative: string;
  metrics: Array<{ label: string; value: string }>;
  signalType: SignalType[];
  fictional: true;
}

export const exampleOutputs: ExampleOutput[] = [
  {
    id: "acme-corp",
    accountName: "Acme Corp",
    narrative:
      "6 tickets in 14 days about the same integration issue. Sentiment is declining. CSM should contact the customer before the renewal call.",
    metrics: [
      { label: "ARR", value: "$42k" },
      { label: "Tickets", value: "6 in 14 days" },
    ],
    signalType: ["churn risk"],
    fictional: true,
  },
  {
    id: "nordicpay",
    accountName: "NordicPay",
    narrative:
      "Repeated questions about SSO, audit logs, and admin roles. This likely indicates enterprise expansion intent.",
    metrics: [{ label: "Topics", value: "SSO, audit logs, admin roles" }],
    signalType: ["expansion intent"],
    fictional: true,
  },
  {
    id: "onboarding-step-3",
    accountName: "Onboarding step 3 cluster",
    narrative:
      "37 tickets from 11 customers relate to onboarding step 3. Four of those customers are in the target ICP. Product should prioritize this.",
    metrics: [
      { label: "Tickets", value: "37" },
      { label: "Customers", value: "11" },
      { label: "In target ICP", value: "4" },
    ],
    signalType: ["onboarding issue", "bug cluster"],
    fictional: true,
  },
];

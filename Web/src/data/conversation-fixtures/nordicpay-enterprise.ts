import type { Conversation } from "./types";

export const nordicpayEnterprise: Conversation = {
  id: "nordicpay-enterprise",
  scenarioLabel: "NordicPay enterprise thread → expansion intent",
  account: "NordicPay",
  productContext:
    "Fintech, Growth plan. 3 enterprise-tier feature inquiries in a single support thread over 5 days.",
  messages: [
    {
      id: "msg-1",
      author: "customer",
      authorName: "Linnea Strand",
      timestamp: "2026-05-05T10:02:00Z",
      body: "Hi there — we're evaluating whether to move our team onto your Enterprise plan. The main blocker right now is SSO. Do you support SAML-based single sign-on? We need it before we can roll out to the wider org.",
    },
    {
      id: "msg-2",
      author: "agent",
      authorName: "Priya Kapoor",
      timestamp: "2026-05-05T10:18:00Z",
      body: "Hi Linnea! Yes, SAML SSO is available on our Enterprise tier. I can set up a sandbox for your identity team to test the integration. Would that be helpful?",
    },
    {
      id: "msg-3",
      author: "customer",
      authorName: "Linnea Strand",
      timestamp: "2026-05-06T08:45:00Z",
      body: "That would be great, thanks. One more thing — our compliance team is asking about audit logs. Can we get a full export of user activity, login events, and permission changes? They need it for SOC 2.",
    },
    {
      id: "msg-4",
      author: "agent",
      authorName: "Priya Kapoor",
      timestamp: "2026-05-06T09:10:00Z",
      body: "Absolutely. The Enterprise plan includes a full audit log with CSV and API export. It covers logins, permission changes, data access, and admin actions. I'll include the audit log docs in the sandbox invite.",
    },
    {
      id: "msg-5",
      author: "customer",
      authorName: "Linnea Strand",
      timestamp: "2026-05-07T14:30:00Z",
      body: "Perfect. Last question for now — we need granular admin roles. Right now everyone on our account is either an admin or a regular user. We'd like to create custom roles: a billing admin, a read-only auditor, and a team lead who can manage their own group but not the whole org.",
    },
    {
      id: "msg-6",
      author: "agent",
      authorName: "Priya Kapoor",
      timestamp: "2026-05-07T14:55:00Z",
      body: "Custom admin roles are on our Enterprise plan too. You can define scoped roles with per-resource permissions. The billing admin, auditor, and team-lead examples you described would all be configurable out of the box.",
    },
    {
      id: "msg-7",
      author: "customer",
      authorName: "Linnea Strand",
      timestamp: "2026-05-08T09:00:00Z",
      body: "This is exactly what we need. I'll loop in our CTO and procurement team to talk pricing and timeline. Can you connect us with someone on the sales side?",
    },
  ],
  annotations: [
    {
      id: "ann-1",
      range: { messageId: "msg-1", start: 80, end: 208 },
      signalType: "expansion intent",
      confidence: "high",
      rationale:
        "Customer is explicitly evaluating an upgrade to the Enterprise plan and identifies SSO as the gate to a wider rollout, signalling organisational expansion.",
      suggestedAction:
        "Route to sales or CSM to initiate an Enterprise upgrade conversation and coordinate the SSO sandbox trial.",
    },
    {
      id: "ann-2",
      range: { messageId: "msg-3", start: 51, end: 198 },
      signalType: "expansion intent",
      confidence: "high",
      rationale:
        "Customer's compliance team is requesting audit log exports for SOC 2 — a strong indicator that the organisation is preparing for enterprise-grade adoption.",
      suggestedAction:
        "CSM should prepare an Enterprise feature comparison and loop in the customer's compliance contact to accelerate the security review.",
    },
    {
      id: "ann-3",
      range: { messageId: "msg-5", start: 41, end: 276 },
      signalType: "expansion intent",
      confidence: "high",
      rationale:
        "Customer describes a detailed custom admin roles requirement with three specific personas, indicating serious planning for a large-scale rollout.",
      suggestedAction:
        "Sales should prepare a custom roles demo environment and schedule a joint call with the customer's IT lead and CSM.",
    },
    {
      id: "ann-4",
      range: { messageId: "msg-7", start: 47, end: 152 },
      signalType: "expansion intent",
      confidence: "high",
      rationale:
        "Customer is bringing CTO and procurement into the conversation, which signals active buying motion and imminent deal progression.",
      suggestedAction:
        "Sales should prepare an Enterprise pricing proposal and coordinate a discovery call with the CTO and procurement team via the CSM.",
    },
  ],
};

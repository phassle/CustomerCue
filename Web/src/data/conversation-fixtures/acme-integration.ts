import type { Conversation } from "./types";

export const acmeIntegration: Conversation = {
  id: "acme-integration",
  scenarioLabel: "Acme integration thread → churn risk + bug cluster",
  account: "Acme Corp",
  productContext:
    "$42k ARR, renewal in 38 days. 6 tickets in 14 days about a failing Salesforce sync. Sentiment declining.",
  messages: [
    {
      id: "msg-1",
      author: "customer",
      authorName: "Dana Reeves",
      timestamp: "2026-04-28T09:14:00Z",
      body: "Hi — our Salesforce sync has been failing since last Thursday. We're getting a 502 error every time it tries to push closed-won opportunities. This is the third time I've written in about this.",
    },
    {
      id: "msg-2",
      author: "agent",
      authorName: "Kai Nakamura",
      timestamp: "2026-04-28T09:31:00Z",
      body: "Sorry to hear that, Dana. Let me pull up the logs for your Salesforce integration. Can you confirm whether the 502 is happening on all object types or just closed-won opportunities?",
    },
    {
      id: "msg-3",
      author: "customer",
      authorName: "Dana Reeves",
      timestamp: "2026-04-28T09:47:00Z",
      body: "Just closed-won opportunities. Contacts and accounts sync fine. We've had to update Salesforce manually for two weeks now and it's burning hours. Our renewal is coming up and honestly this is making it hard to justify the cost.",
    },
    {
      id: "msg-4",
      author: "agent",
      authorName: "Kai Nakamura",
      timestamp: "2026-04-28T10:05:00Z",
      body: "I completely understand the frustration. I've reproduced the 502 on our side — it looks like a serialisation bug in our Salesforce adapter when the opportunity amount exceeds six digits. Engineering has flagged it as a P1.",
    },
    {
      id: "msg-5",
      author: "customer",
      authorName: "Dana Reeves",
      timestamp: "2026-04-28T10:22:00Z",
      body: "That matches what we're seeing — our enterprise deals are all six or seven figures. How long until the fix ships? We can't keep doing manual entry, and I need to give my VP an answer before our renewal review next week.",
    },
    {
      id: "msg-6",
      author: "agent",
      authorName: "Kai Nakamura",
      timestamp: "2026-04-28T10:40:00Z",
      body: "Engineering is targeting a patch by end of day Wednesday. I'll follow up personally once it's deployed and verify the sync on your account. In the meantime, I've escalated this to your CSM so they have context for the renewal discussion.",
    },
  ],
  annotations: [
    {
      id: "ann-1",
      range: { messageId: "msg-1", start: 143, end: 193 },
      signalType: "bug cluster",
      confidence: "high",
      rationale:
        "Customer explicitly states this is the third time they've raised the same integration failure, indicating a recurring unresolved bug.",
      suggestedAction:
        "Check whether other accounts report the same Salesforce sync 502 and link to existing bug ticket.",
    },
    {
      id: "ann-2",
      range: { messageId: "msg-3", start: 146, end: 227 },
      signalType: "churn risk",
      confidence: "high",
      rationale:
        "Customer directly ties the unresolved issue to an upcoming renewal and questions whether the cost is justified.",
      suggestedAction:
        "Alert the CSM immediately; prepare a retention offer or executive sponsor call before the renewal review.",
    },
    {
      id: "ann-3",
      range: { messageId: "msg-3", start: 64, end: 145 },
      signalType: "product friction",
      confidence: "medium",
      rationale:
        "Customer describes a two-week-long manual workaround caused by a broken sync, indicating significant workflow disruption.",
      suggestedAction:
        "Quantify the manual effort across affected accounts and feed into the P1 prioritisation case.",
    },
    {
      id: "ann-4",
      range: { messageId: "msg-4", start: 62, end: 180 },
      signalType: "bug cluster",
      confidence: "high",
      rationale:
        "Agent reproduces the 502 and identifies a specific serialisation bug in the Salesforce adapter affecting large opportunity amounts.",
      suggestedAction:
        "Verify how many accounts have six-digit-plus opportunities and proactively notify them if they may be affected.",
    },
    {
      id: "ann-5",
      range: { messageId: "msg-5", start: 152, end: 219 },
      signalType: "churn risk",
      confidence: "high",
      rationale:
        "Customer needs an answer for their VP before the renewal review, escalating urgency and signalling that the renewal is at risk.",
      suggestedAction:
        "Ensure the fix timeline is communicated to the CSM and VP-level stakeholder before the renewal review meeting.",
    },
  ],
};

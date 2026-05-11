import type { Conversation } from "./types";

export const step3Onboarding: Conversation = {
  id: "step3-onboarding",
  scenarioLabel: "Helix Analytics — onboarding step 3 blocker",
  account: "Helix Analytics",
  productContext:
    "$18k ARR, onboarded 9 days ago. 4 tickets about step 3 of the setup wizard. One of 11 customers stuck at the same step.",
  messages: [
    {
      id: "msg-1",
      author: "customer",
      authorName: "Priya Sharma",
      timestamp: "2026-05-02T11:08:00Z",
      body: "We're stuck on step 3 of the onboarding wizard — the data-source connection page. We've tried connecting our Postgres instance three times and it just spins for about 90 seconds then times out. Our team can't proceed until this is done.",
    },
    {
      id: "msg-2",
      author: "agent",
      authorName: "Leo Brennan",
      timestamp: "2026-05-02T11:24:00Z",
      body: "Hi Priya, sorry about that. Can you confirm whether you're using the hosted or self-managed Postgres option? I'll also check the connection logs on our side to see where the timeout is happening.",
    },
    {
      id: "msg-3",
      author: "customer",
      authorName: "Priya Sharma",
      timestamp: "2026-05-02T11:41:00Z",
      body: "Hosted, on AWS RDS. We followed the docs exactly — allowlisted your IPs, created the read-only user, tested the credentials locally. Everything works outside your wizard. We even tried the CSV upload workaround from your help centre but it only imported a subset of our columns.",
    },
    {
      id: "msg-4",
      author: "agent",
      authorName: "Leo Brennan",
      timestamp: "2026-05-02T12:03:00Z",
      body: "I see the timeout in our logs — the wizard is attempting to enumerate all schemas and it chokes on databases with more than 50 schemas. Your RDS instance has 73. This is a known limitation we haven't documented well. I can manually push your account past step 3, but the wizard should handle this automatically.",
    },
    {
      id: "msg-5",
      author: "customer",
      authorName: "Priya Sharma",
      timestamp: "2026-05-02T12:20:00Z",
      body: "Please do push us past it for now. But honestly, three of my colleagues have already given up trying to set this up on their own. If the first week is this hard, it doesn't bode well for getting the rest of the team onboarded. We need this fixed properly — we can't hand-hold every new user through step 3.",
    },
  ],
  annotations: [
    {
      id: "ann-1",
      range: { messageId: "msg-1", start: 0, end: 75 },
      signalType: "onboarding issue",
      confidence: "high",
      rationale:
        "Customer identifies the exact onboarding step (step 3, data-source connection) where they are blocked, indicating a repeatable friction point.",
      suggestedAction:
        "Escalate to the product team as a step-3 blocker pattern — this is one of 11 customers stuck at the same point in the wizard.",
    },
    {
      id: "ann-2",
      range: { messageId: "msg-3", start: 171, end: 278 },
      signalType: "onboarding issue",
      confidence: "medium",
      rationale:
        "Customer tried the documented CSV upload workaround but it only partially worked, showing that the fallback path for step 3 is also broken.",
      suggestedAction:
        "Flag to PM that the CSV workaround is incomplete — product should either fix the primary flow or make the fallback reliable.",
    },
    {
      id: "ann-3",
      range: { messageId: "msg-4", start: 32, end: 135 },
      signalType: "onboarding issue",
      confidence: "high",
      rationale:
        "Agent confirms a known schema-enumeration limitation that causes the step-3 timeout for databases with more than 50 schemas — a product gap, not a user error.",
      suggestedAction:
        "Escalate to the feature team to add schema pagination or filtering in the wizard — the 50-schema limit affects any mid-size customer.",
    },
    {
      id: "ann-4",
      range: { messageId: "msg-5", start: 49, end: 129 },
      signalType: "onboarding issue",
      confidence: "high",
      rationale:
        "Customer reports that three colleagues have already abandoned self-serve onboarding, signalling that step 3 is a systemic adoption barrier, not an isolated incident.",
      suggestedAction:
        "Route to product leadership as a time-to-value blocker — step-3 friction is suppressing team-wide adoption and threatens expansion within the account.",
    },
  ],
};

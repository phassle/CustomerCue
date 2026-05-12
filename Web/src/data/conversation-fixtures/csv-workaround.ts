import type { Conversation } from "./types";

export const csvWorkaround: Conversation = {
  id: "csv-workaround",
  scenarioLabel: "Vantage CSV export → manual workaround + documentation gap",
  account: "Vantage Analytics",
  productContext:
    "$28k ARR, 14-month customer. Power user team of 6, heavy reporting workflow. No open escalations until now.",
  messages: [
    {
      id: "msg-1",
      author: "customer",
      authorName: "Priya Sharma",
      timestamp: "2026-05-05T14:22:00Z",
      body: "Hi — is there a way to export our usage dashboard as CSV? I can't find the option anywhere in the reporting section.",
    },
    {
      id: "msg-2",
      author: "agent",
      authorName: "Leo Andersen",
      timestamp: "2026-05-05T14:38:00Z",
      body: "Hey Priya! There isn't a direct CSV export for the usage dashboard right now. Some customers use the API to pull the data and convert it themselves. I know it's not ideal — let me check if there's a workaround I can suggest.",
    },
    {
      id: "msg-3",
      author: "customer",
      authorName: "Priya Sharma",
      timestamp: "2026-05-05T14:55:00Z",
      body: "Yeah, we actually already built a manual workaround for this. Every Monday our ops lead exports the raw events via the API, runs a Python script to reshape the columns, and pastes the output into a shared Google Sheet. It takes about 45 minutes each time. We've been doing this for three months.",
    },
    {
      id: "msg-4",
      author: "agent",
      authorName: "Leo Andersen",
      timestamp: "2026-05-05T15:12:00Z",
      body: "That's a significant time investment — thanks for sharing the detail. I checked our documentation and I see the API guide covers raw event pulls but doesn't mention the column mapping your team needs for the usage dashboard format. That's a gap we should close.",
    },
    {
      id: "msg-5",
      author: "customer",
      authorName: "Priya Sharma",
      timestamp: "2026-05-05T15:30:00Z",
      body: "Exactly — we had to reverse-engineer the column layout from the UI ourselves. An API guide that documented the dashboard schema would have saved us a week of trial and error. And honestly, a native export button would save us two hours a month going forward.",
    },
    {
      id: "msg-6",
      author: "agent",
      authorName: "Leo Andersen",
      timestamp: "2026-05-05T15:48:00Z",
      body: "Completely fair. I've filed a documentation request to add the dashboard column mapping to our API guide, and I've flagged the native CSV export as a feature request with the product team. I'll keep you posted on both.",
    },
  ],
  annotations: [
    {
      id: "ann-1",
      range: { messageId: "msg-3", start: 62, end: 218 },
      signalType: "repeated manual workaround",
      confidence: "high",
      rationale:
        "Customer describes a recurring weekly manual process (API export → Python reshape → Google Sheet) they've maintained for three months to compensate for missing functionality.",
      suggestedAction:
        "Quantify the aggregate manual effort across accounts hitting this gap and feed into the CSV export feature prioritisation.",
    },
    {
      id: "ann-2",
      range: { messageId: "msg-3", start: 256, end: 295 },
      signalType: "repeated manual workaround",
      confidence: "medium",
      rationale:
        "The three-month duration confirms the workaround is entrenched, not a one-off — the team has absorbed it into their operational rhythm.",
      suggestedAction:
        "Survey other power-user accounts to determine how many have built similar workarounds independently.",
    },
    {
      id: "ann-3",
      range: { messageId: "msg-4", start: 70, end: 231 },
      signalType: "documentation gap",
      confidence: "high",
      rationale:
        "Agent confirms the API documentation covers raw event pulls but omits the column mapping needed for the usage dashboard format.",
      suggestedAction:
        "Update the API guide to include dashboard column schema and link it from the reporting section of the product.",
    },
    {
      id: "ann-4",
      range: { messageId: "msg-5", start: 10, end: 77 },
      signalType: "documentation gap",
      confidence: "high",
      rationale:
        "Customer had to reverse-engineer the column layout from the UI, confirming the documentation gap caused measurable wasted effort (one week of trial and error).",
      suggestedAction:
        "Prioritise publishing the dashboard schema documentation and notify the customer when it's live.",
    },
  ],
};

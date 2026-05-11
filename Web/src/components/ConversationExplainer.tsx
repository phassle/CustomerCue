import { useState } from "preact/hooks";
import { acmeIntegration } from "../data/conversation-fixtures/acme-integration";
import { nordicpayEnterprise } from "../data/conversation-fixtures/nordicpay-enterprise";
import { step3Onboarding } from "../data/conversation-fixtures/step3-onboarding";
import { csvWorkaround } from "../data/conversation-fixtures/csv-workaround";
import { ScenarioPicker } from "./ScenarioPicker";
import { ConversationThread } from "./ConversationThread";

const scenarios = [
  acmeIntegration,
  nordicpayEnterprise,
  step3Onboarding,
  csvWorkaround,
];

export function ConversationExplainer() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section class="mx-auto max-w-5xl px-6 py-24 md:px-10">
      <h2 class="mb-4 font-display text-2xl font-bold md:text-3xl">
        Watch a support conversation become a signal.
      </h2>
      <p class="mb-12 max-w-2xl text-muted">
        Click any highlight to see the rationale. Switch scenarios to see four
        signal types in action.
      </p>
      <ScenarioPicker
        scenarios={scenarios}
        activeIndex={activeIndex}
        onSelect={setActiveIndex}
      />
      <div class="mt-6">
        <ConversationThread conversation={scenarios[activeIndex]} />
      </div>
    </section>
  );
}

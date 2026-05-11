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
    <div class="mx-auto max-w-4xl px-4">
      <ScenarioPicker
        scenarios={scenarios}
        activeIndex={activeIndex}
        onSelect={setActiveIndex}
      />
      <div class="mt-6">
        <ConversationThread conversation={scenarios[activeIndex]} />
      </div>
    </div>
  );
}

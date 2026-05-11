import { useState } from "preact/hooks";
import { acmeIntegration } from "../data/conversation-fixtures/acme-integration";
import { nordicpayEnterprise } from "../data/conversation-fixtures/nordicpay-enterprise";
import { step3Onboarding } from "../data/conversation-fixtures/step3-onboarding";
import { csvWorkaround } from "../data/conversation-fixtures/csv-workaround";
import type { Annotation } from "../data/conversation-fixtures/types";
import { ScenarioPicker } from "./ScenarioPicker";
import { ConversationThread } from "./ConversationThread";
import { RationalePanel } from "./RationalePanel";

const scenarios = [
  acmeIntegration,
  nordicpayEnterprise,
  step3Onboarding,
  csvWorkaround,
];

export function ConversationExplainer() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedAnnotation, setSelectedAnnotation] =
    useState<Annotation | null>(null);

  const handleScenarioSelect = (index: number) => {
    setActiveIndex(index);
    setSelectedAnnotation(null);
  };

  return (
    <div class="mx-auto max-w-4xl px-4">
      <ScenarioPicker
        scenarios={scenarios}
        activeIndex={activeIndex}
        onSelect={handleScenarioSelect}
      />
      <div class="mt-6 md:flex md:gap-6">
        <div class="min-w-0 md:flex-1">
          <ConversationThread
            conversation={scenarios[activeIndex]}
            onAnnotationClick={setSelectedAnnotation}
          />
        </div>
        {selectedAnnotation && (
          <RationalePanel
            annotation={selectedAnnotation}
            onClose={() => setSelectedAnnotation(null)}
          />
        )}
      </div>
    </div>
  );
}

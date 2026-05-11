import { useState, useMemo } from "preact/hooks";
import { acmeIntegration } from "../data/conversation-fixtures/acme-integration";
import { nordicpayEnterprise } from "../data/conversation-fixtures/nordicpay-enterprise";
import { step3Onboarding } from "../data/conversation-fixtures/step3-onboarding";
import { csvWorkaround } from "../data/conversation-fixtures/csv-workaround";
import { SIGNAL_NAMES, type SignalType } from "../lib/signal-catalog";
import { ScenarioPicker } from "./ScenarioPicker";
import { ConversationThread } from "./ConversationThread";
import { SignalTypeFilter } from "./SignalTypeFilter";

const scenarios = [
  acmeIntegration,
  nordicpayEnterprise,
  step3Onboarding,
  csvWorkaround,
];

export function ConversationExplainer() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [hiddenSignalTypes, setHiddenSignalTypes] = useState<Set<SignalType>>(new Set());

  const conversation = scenarios[activeIndex];

  const activeSignalTypes = useMemo(() => {
    const types = [...new Set(conversation.annotations.map((a) => a.signalType))];
    const order = new Map(SIGNAL_NAMES.map((name, i) => [name, i]));
    return types.sort((a, b) => (order.get(a) ?? 0) - (order.get(b) ?? 0));
  }, [conversation]);

  function handleScenarioChange(index: number) {
    setActiveIndex(index);
    setHiddenSignalTypes(new Set());
  }

  function handleToggle(signalType: SignalType) {
    setHiddenSignalTypes((prev) => {
      const next = new Set(prev);
      if (next.has(signalType)) {
        next.delete(signalType);
      } else {
        next.add(signalType);
      }
      return next;
    });
  }

  return (
    <div class="mx-auto max-w-4xl px-4">
      <ScenarioPicker
        scenarios={scenarios}
        activeIndex={activeIndex}
        onSelect={handleScenarioChange}
      />
      <div class="mt-4">
        <SignalTypeFilter
          activeSignalTypes={activeSignalTypes}
          hiddenSignalTypes={hiddenSignalTypes}
          onToggle={handleToggle}
        />
      </div>
      <div class="mt-6">
        <ConversationThread
          conversation={conversation}
          hiddenSignalTypes={hiddenSignalTypes}
        />
      </div>
    </div>
  );
}

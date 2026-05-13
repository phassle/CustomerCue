import { useState } from "preact/hooks";
import {
  WEEKLY_CONVERSATIONS,
  CUSTOMER_COUNT,
  BASE_RATES,
} from "./inbox-estimator-fixtures";
import { estimateSignals } from "./inbox-estimator";
import type { SignalEstimate } from "./inbox-estimator";

const BUCKET_LABELS: readonly {
  key: keyof SignalEstimate;
  label: string;
}[] = [
  { key: "churnRisk", label: BASE_RATES.churnRisk.signals.join(" · ") },
  {
    key: "expansionIntent",
    label: BASE_RATES.expansionIntent.signals.join(" · "),
  },
  {
    key: "productFrictionAndBugs",
    label: BASE_RATES.productFrictionAndBugs.signals.join(" · "),
  },
  { key: "longTail", label: "Other revenue signals" },
];

function formatRange(low: number, high: number): string {
  return `≈ ${low}–${high} / week`;
}

export function InboxEstimator() {
  const [weeklyConversations, setWeeklyConversations] = useState<number>(
    WEEKLY_CONVERSATIONS.default,
  );
  const [customerCount, setCustomerCount] = useState<number>(
    CUSTOMER_COUNT.default,
  );

  const estimate = estimateSignals(weeklyConversations, customerCount);

  return (
    <div>
      <div class="mb-10 flex flex-col gap-6 max-w-xl mx-auto">
        <div>
          <label
            for="weekly-conversations"
            class="block font-display text-sm font-semibold mb-2"
          >
            <span class="font-mono tabular-nums">{weeklyConversations}</span>{" "}
            conversations per week
          </label>
          <input
            id="weekly-conversations"
            type="range"
            min={WEEKLY_CONVERSATIONS.min}
            max={WEEKLY_CONVERSATIONS.max}
            step={WEEKLY_CONVERSATIONS.step}
            value={weeklyConversations}
            onInput={(e) =>
              setWeeklyConversations(
                Number((e.target as HTMLInputElement).value),
              )
            }
            class="w-full accent-accent"
          />
        </div>
        <div>
          <label
            for="customer-count"
            class="block font-display text-sm font-semibold mb-2"
          >
            <span class="font-mono tabular-nums">{customerCount}</span>{" "}
            customers
          </label>
          <input
            id="customer-count"
            type="range"
            min={CUSTOMER_COUNT.min}
            max={CUSTOMER_COUNT.max}
            step={CUSTOMER_COUNT.step}
            value={customerCount}
            onInput={(e) =>
              setCustomerCount(Number((e.target as HTMLInputElement).value))
            }
            class="w-full accent-accent"
          />
        </div>
      </div>

      <div
        class="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6 mx-auto max-w-3xl"
        aria-live="polite"
      >
        {BUCKET_LABELS.map(({ key, label }) => (
          <div
            key={key}
            class="rounded-lg border border-foreground/10 px-4 py-5 text-center"
          >
            <span class="font-mono text-lg font-semibold tabular-nums md:text-2xl">
              {formatRange(estimate[key].low, estimate[key].high)}
            </span>
            <span class="mt-2 block font-display text-sm font-semibold tracking-wide text-muted">
              {label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

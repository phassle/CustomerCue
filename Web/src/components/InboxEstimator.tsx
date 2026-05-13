import { useState, useRef, useCallback, useEffect } from "preact/hooks";
import {
  WEEKLY_CONVERSATIONS,
  CUSTOMER_COUNT,
  BASE_RATES,
} from "./inbox-estimator-fixtures";
import { estimateSignals, type SignalEstimate } from "./inbox-estimator";

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

const DEBOUNCE_MS = 500;

function formatRange(low: number, high: number): string {
  return `≈ ${low}–${high} / week`;
}

function parseSliderValue(e: Event): number {
  return Number((e.target as HTMLInputElement).value);
}

function summariseEstimate(estimate: SignalEstimate): string {
  let totalLow = 0;
  let totalHigh = 0;
  for (const r of Object.values(estimate)) {
    totalLow += r.low;
    totalHigh += r.high;
  }
  return `Estimated ${totalLow} to ${totalHigh} total signals per week`;
}

export function InboxEstimator() {
  const [weeklyConversations, setWeeklyConversations] = useState<number>(
    WEEKLY_CONVERSATIONS.default,
  );
  const [customerCount, setCustomerCount] = useState<number>(
    CUSTOMER_COUNT.default,
  );
  const [announcement, setAnnouncement] = useState("");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const estimate = estimateSignals(weeklyConversations, customerCount);

  const scheduleAnnouncement = useCallback(
    (est: SignalEstimate) => {
      if (debounceRef.current !== null) {
        clearTimeout(debounceRef.current);
      }
      debounceRef.current = setTimeout(() => {
        setAnnouncement(summariseEstimate(est));
        debounceRef.current = null;
      }, DEBOUNCE_MS);
    },
    [],
  );

  const flushAnnouncement = useCallback(
    (est: SignalEstimate) => {
      if (debounceRef.current !== null) {
        clearTimeout(debounceRef.current);
        debounceRef.current = null;
      }
      setAnnouncement(summariseEstimate(est));
    },
    [],
  );

  useEffect(() => {
    return () => {
      if (debounceRef.current !== null) clearTimeout(debounceRef.current);
    };
  }, []);

  const handleConversationsInput = (e: Event) => {
    const val = parseSliderValue(e);
    setWeeklyConversations(val);
    scheduleAnnouncement(estimateSignals(val, customerCount));
  };

  const handleConversationsChange = (e: Event) => {
    const val = parseSliderValue(e);
    setWeeklyConversations(val);
    flushAnnouncement(estimateSignals(val, customerCount));
  };

  const handleCustomerInput = (e: Event) => {
    const val = parseSliderValue(e);
    setCustomerCount(val);
    scheduleAnnouncement(estimateSignals(weeklyConversations, val));
  };

  const handleCustomerChange = (e: Event) => {
    const val = parseSliderValue(e);
    setCustomerCount(val);
    flushAnnouncement(estimateSignals(weeklyConversations, val));
  };

  return (
    <div>
      <div data-testid="slider-container" class="mb-10 grid grid-cols-1 md:grid-cols-2 gap-6 mx-auto">
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
            aria-valuetext={`${weeklyConversations} conversations per week`}
            onInput={handleConversationsInput}
            onChange={handleConversationsChange}
            class="w-full accent-accent touch-target-slider"
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
            aria-valuetext={`${customerCount} customers`}
            onInput={handleCustomerInput}
            onChange={handleCustomerChange}
            class="w-full accent-accent touch-target-slider"
          />
        </div>
      </div>

      <div
        data-testid="output-cards"
        class="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 mx-auto max-w-3xl"
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
        <span
          data-sr-announcement
          class="sr-only"
          aria-atomic="true"
        >
          {announcement}
        </span>
      </div>
    </div>
  );
}

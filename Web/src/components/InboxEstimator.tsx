import { useState, useRef, useCallback, useEffect } from "preact/hooks";
import {
  WEEKLY_CONVERSATIONS,
  CUSTOMER_COUNT,
  BASE_RATES,
} from "./inbox-estimator-fixtures";
import { estimateSignals, type SignalEstimate, type SignalRange } from "./inbox-estimator";
import { usePrefersReducedMotion } from "./use-prefers-reduced-motion";

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

const ANIMATION_DURATION = 200;

function easeOut(t: number): number {
  return 1 - (1 - t) ** 2;
}

function lerpRange(from: SignalRange, to: SignalRange, progress: number): SignalRange {
  return {
    low: Math.round(from.low + (to.low - from.low) * progress),
    high: Math.round(from.high + (to.high - from.high) * progress),
  };
}

function lerpEstimate(from: SignalEstimate, to: SignalEstimate, progress: number): SignalEstimate {
  return {
    churnRisk: lerpRange(from.churnRisk, to.churnRisk, progress),
    expansionIntent: lerpRange(from.expansionIntent, to.expansionIntent, progress),
    productFrictionAndBugs: lerpRange(from.productFrictionAndBugs, to.productFrictionAndBugs, progress),
    longTail: lerpRange(from.longTail, to.longTail, progress),
  };
}

function estimateChanged(a: SignalEstimate, b: SignalEstimate): boolean {
  return (Object.keys(a) as (keyof SignalEstimate)[]).some(
    k => a[k].low !== b[k].low || a[k].high !== b[k].high,
  );
}

function useAnimatedEstimate(
  target: SignalEstimate,
  reducedMotion: boolean,
): SignalEstimate {
  const [displayed, setDisplayed] = useState(target);
  const ref = useRef({
    from: target,
    to: target,
    displayed: target,
    frameId: null as number | null,
    startTime: null as number | null,
  });

  ref.current.displayed = displayed;

  useEffect(() => {
    return () => {
      if (ref.current.frameId !== null) cancelAnimationFrame(ref.current.frameId);
    };
  }, []);

  useEffect(() => {
    const state = ref.current;

    if (!estimateChanged(target, state.to)) return;

    if (state.frameId !== null) {
      cancelAnimationFrame(state.frameId);
      state.frameId = null;
    }

    state.from = state.displayed;
    state.to = target;

    if (reducedMotion) {
      state.displayed = target;
      state.from = target;
      setDisplayed(target);
      return;
    }

    state.startTime = null;

    const animate = (now: number) => {
      if (state.startTime === null) state.startTime = now;
      const elapsed = now - state.startTime;
      const progress = Math.min(elapsed / ANIMATION_DURATION, 1);
      const eased = easeOut(progress);
      const interpolated = lerpEstimate(state.from, state.to, eased);
      state.displayed = interpolated;
      setDisplayed(interpolated);

      if (progress < 1) {
        state.frameId = requestAnimationFrame(animate);
      } else {
        state.frameId = null;
      }
    };

    state.frameId = requestAnimationFrame(animate);
  });

  return displayed;
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

  const reducedMotion = usePrefersReducedMotion();
  const estimate = estimateSignals(weeklyConversations, customerCount);
  const animatedEstimate = useAnimatedEstimate(estimate, reducedMotion);

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
            <span data-testid={`range-${key}`} class="font-mono text-lg font-semibold tabular-nums md:text-2xl">
              {formatRange(animatedEstimate[key].low, animatedEstimate[key].high)}
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

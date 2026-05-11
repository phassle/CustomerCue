export type FormState =
  | { status: "idle" }
  | { status: "pending" }
  | { status: "success"; id: string }
  | { status: "error"; message: string };

export const FOCUS_RING_ACCENT =
  "focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background";

export const INPUT_CLASS =
  `w-full rounded-lg border border-foreground/20 bg-background px-4 py-2.5 text-foreground placeholder:text-muted/60 ${FOCUS_RING_ACCENT}`;

export function SuccessCard({ headline, id }: { headline: string; id: string }) {
  return (
    <div
      role="status"
      aria-live="polite"
      class="rounded-lg border border-accent/30 bg-accent/10 p-6 text-center"
    >
      <p class="font-display text-lg font-semibold text-foreground">{headline}</p>
      <p class="mt-2 text-sm text-muted">
        Reference: <span class="font-mono">{id}</span>
      </p>
    </div>
  );
}

export function ErrorAlert({ message }: { message: string }) {
  return (
    <div
      role="alert"
      aria-live="assertive"
      class="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400"
    >
      {message}
    </div>
  );
}

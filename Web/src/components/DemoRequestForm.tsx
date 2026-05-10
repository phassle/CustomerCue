import { useState } from "preact/hooks";

type FormState =
  | { status: "idle" }
  | { status: "pending" }
  | { status: "success"; id: string }
  | { status: "error"; message: string };

const INPUT_CLASS =
  "w-full rounded-lg border border-foreground/20 bg-background px-4 py-2.5 text-foreground placeholder:text-muted/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background";

export function DemoRequestForm() {
  const [state, setState] = useState<FormState>({ status: "idle" });
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");

  async function handleSubmit(e: Event) {
    e.preventDefault();
    setState({ status: "pending" });

    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind: "demo", name, email, company }),
      });
      const data = await res.json();
      if (data.ok) {
        setState({ status: "success", id: data.id });
      } else {
        setState({ status: "error", message: data.error });
      }
    } catch {
      setState({
        status: "error",
        message: "Something went wrong. Please try again.",
      });
    }
  }

  if (state.status === "success") {
    return (
      <div role="status" aria-live="polite" class="rounded-lg border border-accent/30 bg-accent/10 p-6 text-center">
        <p class="font-display text-lg font-semibold text-foreground">
          Thanks — we'll be in touch.
        </p>
        <p class="mt-2 text-sm text-muted">
          Reference: <span class="font-mono">{state.id}</span>
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} class="space-y-4 text-left" noValidate>
      {state.status === "error" && (
        <div role="alert" aria-live="assertive" class="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {state.message}
        </div>
      )}

      <div>
        <label for="demo-name" class="mb-1 block text-sm font-medium text-foreground">
          Name
        </label>
        <input
          id="demo-name"
          name="name"
          type="text"
          required
          value={name}
          onInput={(e) => setName((e.target as HTMLInputElement).value)}
          class={INPUT_CLASS}
          placeholder="Your name"
        />
      </div>

      <div>
        <label for="demo-email" class="mb-1 block text-sm font-medium text-foreground">
          Work email
        </label>
        <input
          id="demo-email"
          name="email"
          type="email"
          required
          value={email}
          onInput={(e) => setEmail((e.target as HTMLInputElement).value)}
          class={INPUT_CLASS}
          placeholder="you@company.com"
        />
      </div>

      <div>
        <label for="demo-company" class="mb-1 block text-sm font-medium text-foreground">
          Company
        </label>
        <input
          id="demo-company"
          name="company"
          type="text"
          required
          value={company}
          onInput={(e) => setCompany((e.target as HTMLInputElement).value)}
          class={INPUT_CLASS}
          placeholder="Your company"
        />
      </div>

      <button
        type="submit"
        disabled={state.status === "pending"}
        class="w-full rounded-lg bg-accent px-6 py-3 font-display text-base font-semibold text-background transition-colors hover:bg-accent/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:opacity-60"
      >
        {state.status === "pending" ? "Submitting…" : "Book a demo"}
      </button>
    </form>
  );
}

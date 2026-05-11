import { useState } from "preact/hooks";
import { submitLead } from "../lib/lead-capture";
import {
  type FormState,
  INPUT_CLASS,
  FOCUS_RING_ACCENT,
  SuccessCard,
  ErrorAlert,
} from "./form-primitives";

export function DemoRequestForm() {
  const [state, setState] = useState<FormState>({ status: "idle" });
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");

  async function handleSubmit(e: Event) {
    e.preventDefault();
    setState({ status: "pending" });
    const res = await submitLead({ kind: "demo", name, email, company });
    setState(
      res.ok
        ? { status: "success", id: res.id }
        : { status: "error", message: res.error },
    );
  }

  if (state.status === "success") {
    return <SuccessCard headline="Thanks — we'll be in touch." id={state.id} />;
  }

  return (
    <form onSubmit={handleSubmit} class="space-y-4 text-left" noValidate>
      {state.status === "error" && <ErrorAlert message={state.message} />}

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
        class={`w-full rounded-lg bg-accent px-6 py-3 font-display text-base font-semibold text-background transition-colors hover:bg-accent/90 ${FOCUS_RING_ACCENT} disabled:opacity-60`}
      >
        {state.status === "pending" ? "Submitting…" : "Book a demo"}
      </button>
    </form>
  );
}

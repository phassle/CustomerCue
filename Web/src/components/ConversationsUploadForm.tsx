import { useState } from "preact/hooks";

type FormState =
  | { status: "idle" }
  | { status: "pending" }
  | { status: "success"; id: string }
  | { status: "error"; message: string };

const INPUT_CLASS =
  "w-full rounded-lg border border-foreground/20 bg-background px-4 py-2.5 text-foreground placeholder:text-muted/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background";

export function ConversationsUploadForm() {
  const [state, setState] = useState<FormState>({ status: "idle" });
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [file, setFile] = useState<File | null>(null);

  async function handleSubmit(e: Event) {
    e.preventDefault();
    if (!file) return;
    setState({ status: "pending" });

    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kind: "conversations",
          name,
          email,
          fileMeta: { name: file.name, size: file.size, type: file.type },
        }),
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

  function handleFileChange(e: Event) {
    const input = e.target as HTMLInputElement;
    setFile(input.files?.[0] ?? null);
  }

  if (state.status === "success") {
    return (
      <div role="status" aria-live="polite" class="rounded-lg border border-accent/30 bg-accent/10 p-6 text-center">
        <p class="font-display text-lg font-semibold text-foreground">
          Got it — report inbound within 48 hours.
        </p>
        <p class="mt-2 text-sm text-muted">
          Reference: <span class="font-mono">{state.id}</span>
        </p>
      </div>
    );
  }

  const isPending = state.status === "pending";
  const isSubmitDisabled = isPending || !file;

  return (
    <div class="space-y-6 text-left">
      <dl class="space-y-2 text-sm text-muted">
        <div>
          <dt class="font-semibold text-foreground">File format</dt>
          <dd>Any export from Intercom or Zendesk — CSV, JSON, ZIP all work</dd>
        </div>
        <div>
          <dt class="font-semibold text-foreground">What we'll do</dt>
          <dd>We run your conversations through the same pipeline as a paying customer would</dd>
        </div>
        <div>
          <dt class="font-semibold text-foreground">When the report arrives</dt>
          <dd>Within 48 hours of your submission</dd>
        </div>
      </dl>

      <form onSubmit={handleSubmit} class="space-y-4" noValidate>
        {state.status === "error" && (
          <div role="alert" aria-live="assertive" class="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {state.message}
          </div>
        )}

        <div>
          <label for="conv-name" class="mb-1 block text-sm font-medium text-foreground">
            Name
          </label>
          <input
            id="conv-name"
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
          <label for="conv-email" class="mb-1 block text-sm font-medium text-foreground">
            Work email
          </label>
          <input
            id="conv-email"
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
          <label for="conv-file" class="mb-1 block text-sm font-medium text-foreground">
            Conversations file
          </label>
          <input
            id="conv-file"
            name="file"
            type="file"
            required
            onChange={handleFileChange}
            class={INPUT_CLASS}
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitDisabled}
          class="w-full rounded-lg border border-foreground/20 bg-transparent px-6 py-3 font-display text-base font-semibold text-foreground transition-colors hover:bg-foreground/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:opacity-60"
        >
          {isPending ? "Submitting…" : "Send conversations"}
        </button>
      </form>
    </div>
  );
}

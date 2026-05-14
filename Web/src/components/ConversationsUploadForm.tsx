import { useState } from "preact/hooks";
import { submitLead } from "../lib/lead-capture";
import {
  type FormState,
  INPUT_CLASS,
  FOCUS_RING_ACCENT,
  SuccessCard,
  ErrorAlert,
} from "./form-primitives";

export const CONVERSATIONS_UPLOAD = "conversations-upload";

export function ConversationsUploadForm() {
  const [state, setState] = useState<FormState>({ status: "idle" });
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [file, setFile] = useState<File | null>(null);

  async function handleSubmit(e: Event) {
    e.preventDefault();
    if (!file) return;
    setState({ status: "pending" });
    const res = await submitLead({
      kind: "conversations",
      name,
      email,
      fileMeta: { name: file.name, size: file.size, type: file.type },
    });
    setState(
      res.ok
        ? { status: "success", id: res.id }
        : { status: "error", message: res.error },
    );
  }

  function handleFileChange(e: Event) {
    const input = e.target as HTMLInputElement;
    setFile(input.files?.[0] ?? null);
  }

  if (state.status === "success") {
    return (
      <SuccessCard
        headline="Got it — report inbound within 48 hours."
        id={state.id}
      />
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
        {state.status === "error" && <ErrorAlert message={state.message} />}

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
          class={`w-full rounded-lg border border-foreground/20 bg-transparent px-6 py-3 font-display text-base font-semibold text-foreground transition-colors hover:bg-foreground/10 ${FOCUS_RING_ACCENT} disabled:opacity-60`}
        >
          {isPending ? "Submitting…" : "Send conversations"}
        </button>
      </form>
    </div>
  );
}

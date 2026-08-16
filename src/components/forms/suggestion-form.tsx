"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Lightbulb, LoaderCircle, Send } from "lucide-react";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";

import { TurnstileWidget } from "@/components/forms/turnstile-widget";
import { suggestionSchema, type SuggestionInput } from "@/lib/validation/submissions";

export function SuggestionForm({ projectSlug, projectName }: { projectSlug: SuggestionInput["projectSlug"]; projectName: string }) {
  const [status, setStatus] = useState<{ kind: "idle" | "success" | "error"; message?: string }>({ kind: "idle" });
  const [resetNonce, setResetNonce] = useState(0);
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SuggestionInput>({
    resolver: zodResolver(suggestionSchema),
    defaultValues: {
      projectSlug,
      name: "",
      email: "",
      suggestion: "",
      website: "",
      turnstileToken: "",
    },
  });

  const setToken = useCallback((token: string) => setValue("turnstileToken", token, { shouldValidate: true }), [setValue]);

  async function onSubmit(input: SuggestionInput) {
    setStatus({ kind: "idle" });
    try {
      const response = await fetch("/api/suggestions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      const result = (await response.json()) as { message?: string };
      if (!response.ok) throw new Error(result.message || "The suggestion could not be sent.");
      reset({ projectSlug, name: "", email: "", suggestion: "", website: "", turnstileToken: "" });
      setResetNonce((value) => value + 1);
      setStatus({ kind: "success", message: "Thanks — your idea was sent to Akhil." });
    } catch (error) {
      setResetNonce((value) => value + 1);
      setStatus({ kind: "error", message: error instanceof Error ? error.message : "The suggestion could not be sent." });
    }
  }

  const fieldClass = "mt-2 w-full rounded-xl border border-white/10 bg-black/15 px-3.5 py-3 text-sm text-white outline-none transition placeholder:text-zinc-700 focus:border-accent/60";

  return (
    <section id="suggest-an-idea" className="surface rounded-[1.75rem] p-5 sm:p-7 lg:p-9">
      <div className="grid gap-8 lg:grid-cols-[.72fr_1.28fr]">
        <div>
          <span className="grid size-10 place-items-center rounded-full border border-accent/25 bg-accent/10 text-accent">
            <Lightbulb aria-hidden="true" size={18} />
          </span>
          <p className="mt-5 font-mono text-xs uppercase tracking-[0.16em] text-accent">Open collaboration</p>
          <h2 className="mt-3 text-3xl font-medium tracking-[-0.04em]">Have an idea for {projectName}?</h2>
          <p className="mt-4 max-w-md text-sm leading-6 text-zinc-500">Send a project-specific suggestion. It will be delivered directly to Akhil.</p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <input type="hidden" {...register("projectSlug")} />
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-sm text-zinc-300">Name<input {...register("name")} autoComplete="name" className={fieldClass} placeholder="Your name" />{errors.name ? <span className="mt-1 block text-xs text-red-300">{errors.name.message}</span> : null}</label>
            <label className="text-sm text-zinc-300">Email<input {...register("email")} type="email" autoComplete="email" className={fieldClass} placeholder="you@example.com" />{errors.email ? <span className="mt-1 block text-xs text-red-300">{errors.email.message}</span> : null}</label>
          </div>
          <label className="block text-sm text-zinc-300">Suggestion<textarea {...register("suggestion")} rows={5} className={`${fieldClass} resize-y`} placeholder="A useful feature, workflow or technical direction…" />{errors.suggestion ? <span className="mt-1 block text-xs text-red-300">{errors.suggestion.message}</span> : null}</label>
          <div className="sr-only" aria-hidden="true"><label>Website<input {...register("website")} tabIndex={-1} autoComplete="off" /></label></div>
          <input type="hidden" {...register("turnstileToken")} />
          <TurnstileWidget onToken={setToken} resetNonce={resetNonce} />
          {errors.turnstileToken ? <p className="text-xs text-red-300">{errors.turnstileToken.message}</p> : null}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-sm text-xs leading-5 text-zinc-600">Your details are used only to respond and prevent abuse.</p>
            <button type="submit" disabled={isSubmitting} className="button-primary disabled:cursor-wait disabled:opacity-60">
              {isSubmitting ? <LoaderCircle aria-hidden="true" className="animate-spin" size={15} /> : <Send aria-hidden="true" size={15} />}
              {isSubmitting ? "Sending" : "Send suggestion"}
            </button>
          </div>
          <div aria-live="polite">
            {status.kind !== "idle" ? <p className={`rounded-xl border px-3 py-2.5 text-sm ${status.kind === "success" ? "border-emerald-400/20 bg-emerald-400/[0.07] text-emerald-200" : "border-red-400/20 bg-red-400/[0.06] text-red-200"}`}>{status.message}</p> : null}
          </div>
        </form>
      </div>
    </section>
  );
}

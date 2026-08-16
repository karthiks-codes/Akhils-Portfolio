"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowUpRight, CheckCircle2, LoaderCircle } from "lucide-react";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";

import { TurnstileWidget } from "@/components/forms/turnstile-widget";
import { contactSchema, type ContactFormInput, type ContactInput } from "@/lib/validation/submissions";

type ApiResult = { message?: string; fields?: Record<string, string[]> };

const inputClass =
  "mt-2 w-full rounded-xl border border-white/10 bg-white/[0.025] px-3.5 py-3 text-[0.92rem] text-white outline-none transition placeholder:text-zinc-700 focus:border-accent/60 focus:bg-accent/[0.035]";

export function ContactForm({ compact = false }: { compact?: boolean }) {
  const [status, setStatus] = useState<{ kind: "idle" | "success" | "error"; message?: string }>({ kind: "idle" });
  const [resetNonce, setResetNonce] = useState(0);
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormInput, unknown, ContactInput>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: "", email: "", subject: "", message: "", website: "", turnstileToken: "" },
  });

  const setToken = useCallback((token: string) => setValue("turnstileToken", token, { shouldValidate: true }), [setValue]);

  async function onSubmit(input: ContactInput) {
    setStatus({ kind: "idle" });
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      const result = (await response.json()) as ApiResult;
      if (!response.ok) throw new Error(result.message || "The message could not be sent.");
      reset();
      setResetNonce((value) => value + 1);
      setStatus({ kind: "success", message: "Your message is on its way. Thanks for reaching out." });
    } catch (error) {
      setResetNonce((value) => value + 1);
      setStatus({ kind: "error", message: error instanceof Error ? error.message : "The message could not be sent." });
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={compact ? "space-y-4" : "space-y-5"} noValidate>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="text-sm text-zinc-300">
          Name
          <input {...register("name")} autoComplete="name" placeholder="Your name" className={inputClass} />
          {errors.name ? <span className="mt-1.5 block text-xs text-red-300">{errors.name.message}</span> : null}
        </label>
        <label className="text-sm text-zinc-300">
          Email
          <input {...register("email")} type="email" autoComplete="email" placeholder="you@example.com" className={inputClass} />
          {errors.email ? <span className="mt-1.5 block text-xs text-red-300">{errors.email.message}</span> : null}
        </label>
      </div>
      <label className="block text-sm text-zinc-300">
        Subject <span className="text-zinc-600">— optional</span>
        <input {...register("subject")} placeholder="What would you like to discuss?" className={inputClass} />
        {errors.subject ? <span className="mt-1.5 block text-xs text-red-300">{errors.subject.message}</span> : null}
      </label>
      <label className="block text-sm text-zinc-300">
        Message
        <textarea {...register("message")} rows={compact ? 4 : 6} placeholder="Tell me about the opportunity, idea or problem…" className={`${inputClass} resize-y`} />
        {errors.message ? <span className="mt-1.5 block text-xs text-red-300">{errors.message.message}</span> : null}
      </label>
      <div className="sr-only" aria-hidden="true">
        <label>
          Website
          <input {...register("website")} tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <input type="hidden" {...register("turnstileToken")} />
      <TurnstileWidget onToken={setToken} resetNonce={resetNonce} />
      {errors.turnstileToken ? <p className="text-xs text-red-300">{errors.turnstileToken.message}</p> : null}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-md text-xs leading-5 text-zinc-600">
          By sending, you consent to these details being used only to respond and prevent abuse.
        </p>
        <button type="submit" disabled={isSubmitting} className="button-primary shrink-0 disabled:cursor-wait disabled:opacity-60">
          {isSubmitting ? <LoaderCircle aria-hidden="true" className="animate-spin" size={16} /> : <ArrowUpRight aria-hidden="true" size={16} />}
          {isSubmitting ? "Sending" : "Send message"}
        </button>
      </div>
      <div aria-live="polite">
        {status.kind === "success" ? (
          <p className="flex items-center gap-2 rounded-xl border border-emerald-400/20 bg-emerald-400/[0.07] px-3 py-2.5 text-sm text-emerald-200">
            <CheckCircle2 aria-hidden="true" size={16} /> {status.message}
          </p>
        ) : null}
        {status.kind === "error" ? (
          <p className="rounded-xl border border-red-400/20 bg-red-400/[0.06] px-3 py-2.5 text-sm text-red-200">{status.message}</p>
        ) : null}
      </div>
    </form>
  );
}

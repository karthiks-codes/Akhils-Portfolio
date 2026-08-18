"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { Braces, Grid2X2, Palette, X } from "lucide-react";

const notes = [
  {
    label: "Art direction",
    value: "Dark developer character with editorial restraint and deliberately quiet depth.",
    icon: Palette,
  },
  {
    label: "Design system",
    value: "An 8px spacing rhythm, cool slate accent, crisp borders, and responsive type scales.",
    icon: Grid2X2,
  },
  {
    label: "Built with",
    value: "Next.js App Router, TypeScript, Tailwind CSS, Motion, and accessible Radix primitives.",
    icon: Braces,
  },
] as const;

export function ColophonDialog() {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <button type="button" className="w-fit text-left transition-colors hover:text-accent">
          Designed &amp; engineered in Hyderabad
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[70] bg-black/70 backdrop-blur-sm" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-[80] max-h-[85svh] w-[min(92vw,42rem)] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-[1.8rem] border border-white/15 bg-[#0d1014] p-6 shadow-[0_30px_120px_rgba(0,0,0,.75)] sm:p-8">
          <div className="flex items-start justify-between gap-6">
            <div>
              <p className="font-mono text-[0.64rem] uppercase tracking-[0.17em] text-accent">Colophon / Build notes</p>
              <Dialog.Title className="mt-4 text-4xl font-medium tracking-[-.05em]">Made with intent.</Dialog.Title>
              <Dialog.Description className="mt-4 max-w-xl text-sm leading-6 text-zinc-500">
                A compact record of the visual and technical decisions behind this portfolio.
              </Dialog.Description>
            </div>
            <Dialog.Close asChild>
              <button type="button" aria-label="Close colophon" className="grid size-10 shrink-0 place-items-center rounded-full border border-white/10 text-zinc-500 transition-colors hover:border-white/20 hover:text-white">
                <X aria-hidden="true" size={17} />
              </button>
            </Dialog.Close>
          </div>

          <div className="mt-8 divide-y divide-white/[.08] border-y border-white/[.08]">
            {notes.map(({ label, value, icon: Icon }) => (
              <div key={label} className="grid gap-3 py-5 sm:grid-cols-[10rem_1fr]">
                <p className="flex items-center gap-2 font-mono text-[0.62rem] uppercase tracking-[0.13em] text-zinc-600">
                  <Icon aria-hidden="true" size={14} /> {label}
                </p>
                <p className="text-sm leading-6 text-zinc-400">{value}</p>
              </div>
            ))}
          </div>

          <p className="mt-6 text-xs leading-5 text-zinc-600">
            One more detail: press <kbd className="rounded border border-white/10 px-1.5 py-0.5 text-zinc-400">B</kbd> three times anywhere outside a form.
          </p>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

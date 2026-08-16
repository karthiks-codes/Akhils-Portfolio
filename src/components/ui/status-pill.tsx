import { CircleCheck, Clock3 } from "lucide-react";

import type { ProjectStatus } from "@/types/content";

export function StatusPill({ status }: { status: ProjectStatus }) {
  const completed = status === "completed";
  const Icon = completed ? CircleCheck : Clock3;
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[0.65rem] font-semibold uppercase tracking-[0.14em] ${
        completed
          ? "border-white/10 bg-white/[0.03] text-zinc-400"
          : "border-accent/25 bg-accent/10 text-accent"
      }`}
    >
      <Icon aria-hidden="true" size={12} />
      {completed ? "Completed" : "Ongoing"}
    </span>
  );
}

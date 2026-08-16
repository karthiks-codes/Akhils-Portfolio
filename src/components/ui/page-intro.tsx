import type { ReactNode } from "react";

import { Reveal } from "@/components/ui/reveal";

export function PageIntro({ label, title, description, aside }: { label: string; title: string; description: string; aside?: ReactNode }) {
  return (
    <header className="section-shell pb-14 pt-40 sm:pb-18 sm:pt-48">
      <Reveal className="grid gap-9 lg:grid-cols-[1.25fr_.75fr] lg:items-end">
        <div><p className="eyebrow">{label}</p><h1 className="mt-6 max-w-[13ch] text-[clamp(3rem,8vw,7rem)] font-medium leading-[.94] tracking-[-.065em]">{title}</h1></div>
        <div><p className="lede m-0">{description}</p>{aside ? <div className="mt-7">{aside}</div> : null}</div>
      </Reveal>
    </header>
  );
}

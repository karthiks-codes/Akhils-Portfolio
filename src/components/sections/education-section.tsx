import { GraduationCap } from "lucide-react";

import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { education } from "@/content/site";

export function EducationSection() {
  return (
    <section className="section-rule">
      <div className="section-shell section-space">
        <Reveal><SectionHeading label="Education" title="A foundation in computing and quantitative thinking." description="Formal study across computer science, business systems, mathematics and the engineering fundamentals behind modern software." /></Reveal>
        <div className="mt-14 border-t border-white/10">
          {education.map((item, index) => (
            <Reveal key={item.qualification} className="grid gap-5 border-b border-white/10 py-7 sm:grid-cols-[3.5rem_minmax(0,1fr)_auto] sm:items-start sm:gap-6">
              <div className="hidden size-11 place-items-center rounded-full border border-white/10 text-zinc-600 sm:grid"><GraduationCap aria-hidden="true" size={17} /></div>
              <div><div className="flex items-center gap-3 sm:hidden"><span className="font-mono text-xs text-accent">0{index + 1}</span><span className="font-mono text-[0.62rem] uppercase tracking-[.14em] text-zinc-600">{item.period}</span></div><h3 className="mt-2 text-xl font-medium tracking-[-0.03em] sm:mt-0">{item.qualification}</h3><p className="mt-2 text-sm leading-6 text-zinc-500">{item.institution}</p><p className="mt-4 hidden font-mono text-[0.62rem] uppercase tracking-[.14em] text-zinc-700 sm:block">{item.period}</p></div>
              <div className="sm:text-right"><p className="font-mono text-[0.62rem] uppercase tracking-[.14em] text-zinc-600">{item.resultLabel}</p><p className="mt-1.5 text-lg font-medium text-zinc-300">{item.result}</p></div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

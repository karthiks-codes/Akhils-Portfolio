import { Blocks, BrainCircuit, CloudCog, Code2 } from "lucide-react";

import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";

const domains = [
  { title: "Software", copy: "Turning ideas into complete, working systems across interface and service layers.", icon: Code2 },
  { title: "Intelligence", copy: "Working with ML, NLP, vision and explainability to make software more useful.", icon: BrainCircuit },
  { title: "Infrastructure", copy: "Exploring cloud and DevOps practices that make delivery repeatable and dependable.", icon: CloudCog },
];

export function AboutSection() {
  return (
    <section id="about" className="section-shell section-space scroll-mt-28">
      <Reveal><SectionHeading label="About" title="I like knowing how the whole system works." description="I move between product interfaces, intelligent models and the infrastructure underneath them — because the interesting problems usually live at the boundaries." /></Reveal>
      <div className="mt-14 grid gap-4 lg:grid-cols-[1.15fr_.85fr]">
        <Reveal className="surface relative min-h-[27rem] overflow-hidden rounded-[1.75rem] p-6 sm:p-9">
          <Blocks aria-hidden="true" className="text-accent" size={26} />
          <p className="mt-20 max-w-[24ch] text-[clamp(1.8rem,4.2vw,3.4rem)] font-medium leading-[1.08] tracking-[-0.05em]">
            I enjoy taking a difficult idea apart, understanding its pieces, and rebuilding it as useful software.
          </p>
          <div aria-hidden="true" className="absolute -bottom-28 -right-20 size-80 rounded-full border border-white/[0.06]" />
          <div aria-hidden="true" className="absolute -bottom-10 right-18 size-48 rounded-full border border-accent/10" />
        </Reveal>
        <div className="grid gap-4">
          {domains.map(({ title, copy, icon: Icon }, index) => (
            <Reveal key={title} delay={index * 0.05} className="group rounded-[1.4rem] border border-white/10 bg-white/[0.018] p-5 transition-colors hover:bg-white/[0.035] sm:p-6">
              <div className="flex items-start gap-4">
                <span className="grid size-10 shrink-0 place-items-center rounded-full border border-white/10 text-zinc-500 transition-colors group-hover:border-accent/25 group-hover:text-accent"><Icon aria-hidden="true" size={18} /></span>
                <div><h3 className="text-lg font-medium tracking-[-0.025em]">{title}</h3><p className="mt-2 text-sm leading-6 text-zinc-500">{copy}</p></div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

import { ArrowDownRight } from "lucide-react";

import { Reveal } from "@/components/ui/reveal";
import { toolGroups } from "@/content/skills";

export function ToolsSection() {
  return (
    <section className="section-rule">
      <div className="section-shell section-space">
        <Reveal className="grid gap-8 lg:grid-cols-[.58fr_1.42fr]">
          <div><p className="eyebrow">Tools / Frameworks</p><h2 className="mt-5 max-w-[9ch] text-4xl font-medium tracking-[-0.05em] sm:text-5xl">The working bench.</h2><ArrowDownRight aria-hidden="true" className="mt-8 text-zinc-700" size={28} /></div>
          <div className="border-t border-white/10">
            {toolGroups.map((group, index) => (
              <div key={group.label} className="grid gap-4 border-b border-white/10 py-6 sm:grid-cols-[9rem_1fr] sm:items-start"><p className="font-mono text-[0.65rem] uppercase tracking-[.15em] text-accent">0{index + 1} / {group.label}</p><p className="flex flex-wrap gap-x-2 gap-y-2 text-lg tracking-[-0.025em] text-zinc-300">{group.tools.map((tool) => <span key={tool} className="after:ml-2 after:text-zinc-700 after:content-['·'] last:after:content-none">{tool}</span>)}</p></div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

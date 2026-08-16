import { FileText, UsersRound } from "lucide-react";

import { Reveal } from "@/components/ui/reveal";
import { leadership } from "@/content/site";

export function LeadershipSection() {
  return (
    <section className="section-rule">
      <div className="section-shell section-space">
        <Reveal className="grid gap-10 lg:grid-cols-[.75fr_1.25fr] lg:items-end">
          <div><p className="eyebrow">Leadership</p><h2 className="section-title">Ownership beyond the code.</h2></div>
          <div className="surface rounded-[1.7rem] p-6 sm:p-8">
            <p className="font-mono text-[0.66rem] uppercase tracking-[0.16em] text-accent">{leadership.event}</p>
            <div className="mt-7 grid gap-5 sm:grid-cols-2">
              <div className="border-l border-white/15 pl-5"><FileText aria-hidden="true" className="text-zinc-500" size={19} /><h3 className="mt-5 text-xl font-medium tracking-[-0.03em]">Documentation Lead</h3><p className="mt-2 text-sm leading-6 text-zinc-500">A distinct role focused on the event&apos;s documentation work.</p></div>
              <div className="border-l border-white/15 pl-5"><UsersRound aria-hidden="true" className="text-zinc-500" size={19} /><h3 className="mt-5 text-xl font-medium tracking-[-0.03em]">Accommodation Coordinator</h3><p className="mt-2 text-sm leading-6 text-zinc-500">A separate coordination role for accommodation during the event.</p></div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

import { Reveal } from "@/components/ui/reveal";
import { site } from "@/content/site";
import { BrandGithub } from "@/components/ui/brand-icons";

export function GithubPreview() {
  return (
    <section className="section-rule">
      <div className="section-shell section-space">
        <Reveal className="relative grid gap-10 overflow-hidden rounded-[2rem] border border-white/10 bg-[#0c0f13] p-7 sm:p-10 lg:grid-cols-[1fr_auto] lg:items-end lg:p-14">
          <div aria-hidden="true" className="absolute right-10 top-7 font-mono text-[clamp(5rem,15vw,11rem)] font-semibold tracking-[-.1em] text-white/[0.025] after:content-['CODE']" />
          <div className="relative"><BrandGithub className="text-accent" size={26} /><p className="mt-10 font-mono text-[0.66rem] uppercase tracking-[0.17em] text-zinc-600">github.com/karthiks-codes</p><h2 className="mt-4 max-w-[12ch] text-4xl font-medium leading-[1.02] tracking-[-0.055em] sm:text-6xl">Follow the work at source.</h2><p className="mt-5 max-w-xl text-sm leading-6 text-zinc-500">The dedicated GitHub page stays factual: it points to the confirmed profile and does not manufacture activity, contribution or repository metrics.</p></div>
          <div className="relative flex flex-wrap gap-2.5"><Link href="/github" className="button-secondary">GitHub page <ArrowUpRight aria-hidden="true" size={15} /></Link><a href={site.github} target="_blank" rel="noreferrer" className="button-primary">Open profile <ArrowUpRight aria-hidden="true" size={15} /></a></div>
        </Reveal>
      </div>
    </section>
  );
}

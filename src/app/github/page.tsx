import type { Metadata } from "next";
import { ArrowUpRight, Braces, CloudCog, GitPullRequestArrow, Sparkles } from "lucide-react";

import { PageIntro } from "@/components/ui/page-intro";
import { BrandGithub } from "@/components/ui/brand-icons";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "GitHub",
  description: "Visit Akhil Karthik Boddupalli's confirmed GitHub profile and explore his engineering work at source.",
  alternates: { canonical: "/github" },
};

const areas = [
  { title: "Software systems", copy: "Full-stack product work and practical application architecture.", icon: Braces },
  { title: "AI / ML", copy: "Recommendation, medical imaging, NLP and applied machine-learning work.", icon: Sparkles },
  { title: "Cloud / DevOps", copy: "Containerization, Kubernetes experimentation and infrastructure interests.", icon: CloudCog },
];

export default function GithubPage() {
  return (
    <>
      <PageIntro label="GitHub" title="The work, closer to source." description="This page points to the confirmed public profile. It intentionally avoids invented repository, contribution, star or language metrics." aside={<a href={site.github} target="_blank" rel="noreferrer" className="button-primary">Open @karthiks-codes <ArrowUpRight aria-hidden="true" size={15} /></a>} />
      <section className="section-rule"><div className="section-shell section-space !pt-14"><div className="surface relative overflow-hidden rounded-[2rem] p-7 sm:p-10 lg:p-14"><div aria-hidden="true" className="absolute -right-25 -top-35 size-120 rounded-full border border-white/[.06]" /><BrandGithub className="text-accent" size={30} /><p className="mt-12 font-mono text-[.65rem] uppercase tracking-[.16em] text-zinc-600">Confirmed profile</p><h2 className="mt-4 text-[clamp(2.5rem,7vw,6rem)] font-medium tracking-[-.065em]">karthiks-codes</h2><p className="mt-5 max-w-2xl text-base leading-7 text-zinc-500">Follow the profile directly for the current public repository state. No API-derived metrics are cached or inferred in this build.</p><a href={site.github} target="_blank" rel="noreferrer" className="button-secondary mt-8">github.com/karthiks-codes <ArrowUpRight aria-hidden="true" size={14} /></a></div><div className="mt-5 grid gap-4 md:grid-cols-3">{areas.map(({ title, copy, icon: Icon }) => <article key={title} className="rounded-[1.4rem] border border-white/10 bg-white/[.018] p-6"><Icon aria-hidden="true" className="text-zinc-500" size={20} /><h3 className="mt-7 text-xl font-medium tracking-[-.03em]">{title}</h3><p className="mt-3 text-sm leading-6 text-zinc-500">{copy}</p></article>)}</div><div className="mt-12 flex items-center gap-3 border-t border-white/10 pt-6 text-sm text-zinc-500"><GitPullRequestArrow aria-hidden="true" size={17} className="text-accent" /><p>Project-specific repository links will appear on project cards only after they are confirmed.</p></div></div></section>
    </>
  );
}

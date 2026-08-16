import type { Metadata } from "next";
import { ArrowLeft, ArrowRight, ArrowUpRight, Check, Compass, Layers3, Route, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { SuggestionForm } from "@/components/forms/suggestion-form";
import { ProjectCard } from "@/components/projects/project-card";
import { StatusPill } from "@/components/ui/status-pill";
import { getProject, getRelatedProjects, projects } from "@/content/projects";
import type { SuggestionInput } from "@/lib/validation/submissions";

type ProjectPageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const project = getProject((await params).slug);
  if (!project) return { title: "Project not found" };
  return {
    title: project.title,
    description: project.shortDescription,
    alternates: { canonical: `/projects/${project.slug}` },
    openGraph: { title: `${project.title} — Akhil Karthik Boddupalli`, description: project.shortDescription, url: `/projects/${project.slug}` },
  };
}

export default async function ProjectDetailPage({ params }: ProjectPageProps) {
  const project = getProject((await params).slug);
  if (!project) notFound();
  const related = getRelatedProjects(project);
  const resources = [
    project.githubUrl ? { label: "GitHub", url: project.githubUrl } : null,
    project.demoUrl ? { label: "Live demo", url: project.demoUrl } : null,
    project.documentationUrl ? { label: "Documentation", url: project.documentationUrl } : null,
    project.paperUrl ? { label: "Paper", url: project.paperUrl } : null,
  ].filter((resource): resource is { label: string; url: string } => Boolean(resource));

  return (
    <>
      <article>
        <header className="section-shell pb-16 pt-38 sm:pt-46">
          <Link href="/projects" className="button-quiet text-xs"><ArrowLeft aria-hidden="true" size={14} /> All projects</Link>
          <div className="mt-10 grid gap-10 lg:grid-cols-[1.15fr_.65fr] lg:items-end">
            <div>
              <div className="flex flex-wrap items-center gap-3"><StatusPill status={project.status} /><span className="font-mono text-[.64rem] uppercase tracking-[.15em] text-accent">{project.categories.join(" · ")}</span></div>
              <h1 className="mt-7 max-w-[12ch] text-[clamp(3.3rem,8.5vw,7.8rem)] font-medium leading-[.9] tracking-[-.07em]">{project.title}</h1>
              <p className="mt-5 text-xl tracking-[-.02em] text-zinc-400 sm:text-2xl">{project.subtitle}</p>
            </div>
            <div>
              <p className="lede">{project.longDescription}</p>
              {resources.length ? <div className="mt-6 flex flex-wrap gap-3">{resources.map((resource) => <a key={resource.label} href={resource.url} target="_blank" rel="noreferrer" className="button-secondary">{resource.label}<ArrowUpRight aria-hidden="true" size={14} /></a>)}</div> : null}
            </div>
          </div>
        </header>

        <div className="section-shell mb-18">
          <div className="relative h-56 overflow-hidden rounded-[1.8rem] border border-white/10 bg-[#0d1014] sm:h-72">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_40%,rgba(156,183,231,.18),transparent_30%),linear-gradient(120deg,rgba(255,255,255,.025),transparent_55%)]" />
            <div className="absolute -right-15 -top-30 size-96 rounded-full border border-white/[0.07]" />
            <div className="absolute right-[18%] top-[28%] size-35 rounded-full border border-accent/15" />
            <div className="absolute bottom-7 left-7 right-7 flex items-end justify-between"><span className="font-mono text-[0.65rem] uppercase tracking-[.16em] text-zinc-600">Project field / {project.slug}</span><Layers3 aria-hidden="true" className="text-zinc-600" size={22} /></div>
          </div>
        </div>

        <section className="section-rule">
          <div className="section-shell section-space grid gap-12 lg:grid-cols-[.65fr_1.35fr]">
            <div><p className="eyebrow">Context</p><h2 className="mt-5 text-4xl font-medium tracking-[-.05em]">The problem space.</h2></div>
            <p className="max-w-3xl text-[clamp(1.35rem,2.5vw,2rem)] leading-[1.4] tracking-[-.025em] text-zinc-300">{project.problem}</p>
          </div>
        </section>

        <section className="section-rule">
          <div className="section-shell section-space">
            <div className="grid gap-10 lg:grid-cols-[.65fr_1.35fr]">
              <div><p className="eyebrow">Confirmed work</p><h2 className="mt-5 text-4xl font-medium tracking-[-.05em]">What the evidence supports.</h2></div>
              <div>
                {project.implementation.length ? (
                  <ul className="divide-y divide-white/10 border-y border-white/10">
                    {project.implementation.map((item) => <li key={item} className="flex gap-4 py-5 text-sm leading-6 text-zinc-400"><span className="mt-1 grid size-5 shrink-0 place-items-center rounded-full border border-accent/25 text-accent"><Check aria-hidden="true" size={11} /></span>{item}</li>)}
                  </ul>
                ) : (
                  <div className="rounded-[1.5rem] border border-accent/15 bg-accent/[0.055] p-6"><ShieldCheck aria-hidden="true" className="text-accent" size={20} /><h3 className="mt-4 text-lg font-medium">Current implementation is not confirmed.</h3><p className="mt-2 text-sm leading-6 text-zinc-500">This page keeps the supplied concept and planned workflow separate from claims about what is already working.</p></div>
                )}
                <div className="mt-8 flex flex-wrap gap-2">{project.technologies.map((technology) => <span key={technology} className="rounded-full border border-white/10 px-3 py-2 text-xs text-zinc-500">{technology}</span>)}</div>
              </div>
            </div>
          </div>
        </section>

        {project.pipeline?.length ? (
          <section className="section-rule bg-white/[.012]">
            <div className="section-shell section-space"><div className="flex items-center gap-3"><Route aria-hidden="true" className="text-accent" size={19} /><p className="eyebrow before:hidden">System flow</p></div><ol className="mt-10 grid gap-px overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-3">{project.pipeline.map((step, index) => <li key={`${index}-${step}`} className="relative bg-[#0b0d10] p-5"><span className="font-mono text-[.6rem] text-zinc-700">{String(index + 1).padStart(2, "0")}</span><p className="mt-5 text-sm font-medium text-zinc-300">{step}</p>{index < project.pipeline!.length - 1 ? <ArrowRight aria-hidden="true" className="absolute right-4 top-4 text-zinc-800" size={14} /> : null}</li>)}</ol></div>
          </section>
        ) : null}

        {project.planned?.length ? (
          <section className="section-rule"><div className="section-shell section-space grid gap-10 lg:grid-cols-[.65fr_1.35fr]"><div><p className="eyebrow">Proposed / planned</p><h2 className="mt-5 text-4xl font-medium tracking-[-.05em]">The direction, not a completion claim.</h2></div><ul className="space-y-3">{project.planned.map((item) => <li key={item} className="rounded-2xl border border-white/10 bg-white/[.018] p-5 text-sm leading-6 text-zinc-400">{item}</li>)}</ul></div></section>
        ) : null}

        {project.evidenceNote || project.resultNote ? (
          <section className="section-rule"><div className="section-shell section-space"><div className="surface grid gap-7 rounded-[1.7rem] p-6 sm:p-8 lg:grid-cols-2"><div><Compass aria-hidden="true" className="text-accent" size={19} /><p className="mt-5 font-mono text-[.62rem] uppercase tracking-[.15em] text-zinc-600">Evidence note</p><p className="mt-3 text-sm leading-6 text-zinc-400">{project.evidenceNote ?? "The implementation notes above reflect the supplied project material."}</p></div>{project.resultNote ? <div className="border-t border-white/10 pt-7 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0"><p className="font-mono text-[.62rem] uppercase tracking-[.15em] text-zinc-600">Result limitation</p><p className="mt-3 text-sm leading-6 text-zinc-400">{project.resultNote}</p></div> : null}</div></div></section>
        ) : null}
      </article>

      {project.status === "ongoing" ? <div className="section-shell section-space"><SuggestionForm projectSlug={project.slug as SuggestionInput["projectSlug"]} projectName={project.title} /></div> : null}

      {related.length ? <section className="section-rule"><div className="section-shell section-space"><div className="flex items-end justify-between gap-5"><div><p className="eyebrow">Related work</p><h2 className="mt-5 text-4xl font-medium tracking-[-.05em]">Keep exploring.</h2></div><Link href="/projects" className="button-quiet text-xs">All projects <ArrowRight aria-hidden="true" size={14} /></Link></div><div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">{related.map((item, index) => <ProjectCard key={item.slug} project={item} index={index} compact />)}</div></div></section> : null}
    </>
  );
}

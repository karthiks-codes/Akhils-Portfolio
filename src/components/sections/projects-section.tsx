import { ArrowRight, Lightbulb } from "lucide-react";
import Link from "next/link";

import { ProjectCard } from "@/components/projects/project-card";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { featuredProjects, ongoingProjects } from "@/content/projects";

export function ProjectsSection() {
  return (
    <>
      <section id="projects" className="section-rule scroll-mt-28">
        <div className="section-shell section-space">
          <Reveal><SectionHeading label="Selected work" title="Featured projects" description="Across product, intelligence and research. Dense enough to reveal the engineering; concise enough to scan, with only confirmed technologies and resources." /></Reveal>
          <div className="mt-12 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {featuredProjects.map((project, index) => <ProjectCard key={project.slug} project={project} index={index} />)}
          </div>
        </div>
      </section>
      <section className="section-rule bg-white/[0.012]">
        <div className="section-shell section-space">
          <Reveal className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between"><div><p className="eyebrow">Works in progress</p><h2 className="section-title">Ideas still in motion.</h2></div><div className="flex items-center gap-2 text-sm text-zinc-500"><Lightbulb aria-hidden="true" size={16} className="text-accent" /> Each project page accepts specific suggestions.</div></Reveal>
          <div className="mt-12 grid gap-4 lg:grid-cols-3">
            {ongoingProjects.map((project, index) => <ProjectCard key={project.slug} project={project} index={index + 3} compact />)}
          </div>
        </div>
      </section>
      <section className="section-rule">
        <div className="section-shell py-14 sm:py-20">
          <Reveal className="surface relative overflow-hidden rounded-[1.8rem] p-7 sm:p-10 lg:flex lg:items-center lg:justify-between">
            <div aria-hidden="true" className="absolute -right-12 -top-24 size-72 rounded-full border border-accent/10" />
            <div className="relative"><p className="font-mono text-xs uppercase tracking-[0.16em] text-accent">Project index</p><h2 className="mt-4 text-3xl font-medium tracking-[-0.045em] sm:text-4xl">See every approved project in one place.</h2><p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-500">Filter across AI / ML, full stack, cloud and DevOps, automation, vibe coding and research.</p></div>
            <Link href="/projects" className="button-primary relative mt-7 lg:mt-0">View all projects <ArrowRight aria-hidden="true" size={16} /></Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}

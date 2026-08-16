"use client";

import { LayoutGroup, motion, useReducedMotion } from "motion/react";
import { useMemo, useState } from "react";

import { ProjectCard } from "@/components/projects/project-card";
import { projectCategories, type Project } from "@/types/content";

export function ProjectFilter({ projects }: { projects: Project[] }) {
  const [active, setActive] = useState<(typeof projectCategories)[number]>("All");
  const reduceMotion = useReducedMotion();
  const filtered = useMemo(
    () => (active === "All" ? projects : projects.filter((project) => project.categories.includes(active))),
    [active, projects],
  );

  return (
    <LayoutGroup>
      <div role="tablist" aria-label="Filter projects" className="flex max-w-full gap-2 overflow-x-auto pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {projectCategories.map((category) => (
          <button
            key={category}
            role="tab"
            aria-selected={active === category}
            aria-controls="project-results"
            type="button"
            onClick={() => setActive(category)}
            className={`relative shrink-0 rounded-full border px-3.5 py-2 text-xs font-medium transition-colors ${active === category ? "border-accent/40 text-white" : "border-white/10 text-zinc-500 hover:border-white/20 hover:text-zinc-300"}`}
          >
            {active === category ? <motion.span layoutId="active-project-filter" className="absolute inset-0 -z-10 rounded-full bg-accent/10" transition={reduceMotion ? { duration: 0 } : { type: "spring", stiffness: 420, damping: 34 }} /> : null}
            {category}
          </button>
        ))}
      </div>
      <div className="mt-5 flex items-center justify-between border-b border-white/10 pb-4 font-mono text-[0.65rem] uppercase tracking-[0.14em] text-zinc-600">
        <span>Showing {active}</span>
        <span aria-live="polite">{filtered.length} {filtered.length === 1 ? "project" : "projects"}</span>
      </div>
      <div id="project-results" role="tabpanel" className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((project, index) => <ProjectCard key={project.slug} project={project} index={index} />)}
      </div>
    </LayoutGroup>
  );
}

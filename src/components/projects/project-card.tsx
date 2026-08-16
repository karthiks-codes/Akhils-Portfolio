"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import Link from "next/link";

import { StatusPill } from "@/components/ui/status-pill";
import { BrandGithub } from "@/components/ui/brand-icons";
import type { Project } from "@/types/content";

const projectMarks: Record<string, string> = {
  smartskin: "SS",
  "personalized-news": "PN",
  neurotrace: "NT",
  "house-rental": "HR",
  tripshield: "TS",
  "job-automation": "JA",
  "technical-portfolio": "AK",
};

export function ProjectCard({ project, index = 0, compact = false }: { project: Project; index?: number; compact?: boolean }) {
  const reduceMotion = useReducedMotion();

  return (
    <AnimatePresence mode="popLayout">
      <motion.article
        layout
        layoutId={`project-${project.slug}`}
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.985 }}
        transition={{ duration: reduceMotion ? 0 : 0.35, delay: reduceMotion ? 0 : Math.min(index * 0.035, 0.18) }}
        className={`group relative flex h-full min-h-[27rem] flex-col overflow-hidden rounded-[1.6rem] border border-white/10 bg-[#0d1014] transition-colors hover:border-white/20 hover:bg-[#11151b] ${compact ? "min-h-[23rem]" : ""}`}
      >
        <div className="relative h-36 overflow-hidden border-b border-white/[0.08] sm:h-40">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_34%,rgba(156,183,231,.18),transparent_33%),linear-gradient(120deg,rgba(255,255,255,.02),transparent)]" />
          <div className="absolute -right-8 -top-15 size-52 rounded-full border border-white/[0.07] transition-transform duration-700 group-hover:scale-110" />
          <div className="absolute right-10 top-7 size-25 rounded-full border border-accent/15" />
          <div className="absolute bottom-5 left-5 flex items-end gap-3">
            <span className="font-mono text-[2.75rem] font-medium tracking-[-0.08em] text-white/90">{projectMarks[project.slug]}</span>
            <span className="mb-2 font-mono text-[0.62rem] uppercase tracking-[0.16em] text-zinc-600">Project / {String(index + 1).padStart(2, "0")}</span>
          </div>
        </div>

        <div className="flex flex-1 flex-col p-5 sm:p-6">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="font-mono text-[0.64rem] uppercase tracking-[0.15em] text-accent">{project.categories.join(" · ")}</p>
              <h3 className="mt-3 text-[1.55rem] font-medium tracking-[-0.04em] text-white">{project.title}</h3>
              <p className="mt-1 text-sm text-zinc-500">{project.subtitle}</p>
            </div>
            <StatusPill status={project.status} />
          </div>
          <p className="mt-5 text-sm leading-6 text-zinc-400">{project.shortDescription}</p>
          <ul aria-label="Technologies" className="mt-5 flex flex-wrap gap-1.5">
            {project.technologies.slice(0, compact ? 4 : 5).map((technology) => (
              <li key={technology} className="rounded-full border border-white/[0.08] bg-white/[0.025] px-2.5 py-1 text-[0.68rem] text-zinc-500">{technology}</li>
            ))}
          </ul>
          <div className="mt-auto flex items-center justify-between gap-4 pt-7">
            <div>
              {project.githubUrl ? (
                <a href={project.githubUrl} target="_blank" rel="noreferrer" className="button-quiet text-xs">
                  <BrandGithub size={14} /> GitHub <ArrowUpRight aria-hidden="true" size={12} />
                </a>
              ) : (
                <span className="font-mono text-[0.61rem] uppercase tracking-[0.14em] text-zinc-700">Case notes</span>
              )}
            </div>
            <Link href={`/projects/${project.slug}`} className="button-quiet text-xs text-zinc-300" aria-label={`View ${project.title} project`}>
              View project <ArrowRight aria-hidden="true" size={14} className="transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </motion.article>
    </AnimatePresence>
  );
}

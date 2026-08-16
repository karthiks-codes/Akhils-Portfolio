"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Braces, ChevronRight } from "lucide-react";
import { useState } from "react";

import { skillGroups } from "@/content/skills";

export function SkillsMap() {
  const [active, setActive] = useState(0);
  const reduceMotion = useReducedMotion();
  const group = skillGroups[active];

  return (
    <div className="surface mt-12 overflow-hidden rounded-[1.7rem]">
      <div className="grid lg:grid-cols-[19rem_1fr]">
        <div role="tablist" aria-label="Technical skill groups" className="border-b border-white/10 p-2 lg:border-b-0 lg:border-r">
          {skillGroups.map((item, index) => (
            <button
              key={item.name}
              type="button"
              role="tab"
              aria-selected={active === index}
              aria-controls="skill-panel"
              onClick={() => setActive(index)}
              className={`flex w-full items-center justify-between rounded-xl px-3.5 py-3 text-left text-sm transition-colors ${active === index ? "bg-white/[0.07] text-white" : "text-zinc-500 hover:bg-white/[0.035] hover:text-zinc-300"}`}
            >
              <span className="flex items-center gap-3">
                <span className={`font-mono text-[0.6rem] ${active === index ? "text-accent" : "text-zinc-700"}`}>{String(index + 1).padStart(2, "0")}</span>
                {item.name}
              </span>
              <ChevronRight aria-hidden="true" size={14} className={active === index ? "text-accent" : "text-zinc-700"} />
            </button>
          ))}
        </div>
        <div id="skill-panel" role="tabpanel" className="min-h-[31rem] p-5 sm:p-8 lg:p-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={group.name}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -5 }}
              transition={{ duration: reduceMotion ? 0 : 0.25 }}
            >
              <div className="flex items-start justify-between gap-5">
                <div>
                  <p className="font-mono text-[0.65rem] uppercase tracking-[0.16em] text-accent">Technical map / {String(active + 1).padStart(2, "0")}</p>
                  <h3 className="mt-4 text-3xl font-medium tracking-[-0.04em] sm:text-4xl">{group.name}</h3>
                  <p className="mt-3 max-w-xl text-sm leading-6 text-zinc-500">{group.description}</p>
                </div>
                <span className="hidden size-12 place-items-center rounded-full border border-white/10 text-zinc-500 sm:grid"><Braces aria-hidden="true" size={20} /></span>
              </div>
              <div className="mt-9 flex flex-wrap gap-2.5">
                {group.skills.map((skill, index) => (
                  <motion.span
                    key={skill}
                    initial={{ opacity: 0, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: reduceMotion ? 0 : undefined, delay: reduceMotion ? 0 : Math.min(index * 0.018, 0.2) }}
                    className="rounded-xl border border-white/10 bg-black/15 px-3.5 py-2.5 text-sm text-zinc-300 transition-colors hover:border-accent/30 hover:bg-accent/[0.055] hover:text-white"
                  >
                    {skill}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

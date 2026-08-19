"use client";

import { motion, useReducedMotion } from "motion/react";
import { ArrowDownRight, ArrowRight, ArrowUpRight, Mail, MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import { site } from "@/content/site";
import { assets } from "@/lib/assets/manifest";
import { BrandGithub, BrandLinkedIn } from "@/components/ui/brand-icons";

export function Hero() {
  const reduceMotion = useReducedMotion();
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const onVisibility = () => setVisible(!document.hidden);
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  const reveal = (delay: number) => ({
    initial: { opacity: 0, y: 18 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: reduceMotion ? 0 : 0.7, delay: reduceMotion ? 0 : delay, ease: [0.22, 1, 0.36, 1] as const },
  });

  return (
    <section className="relative flex min-h-[min(1000px,100svh)] items-center overflow-hidden pt-28 sm:pt-32">
      <div className="section-shell relative z-10 grid items-center gap-14 pb-14 lg:grid-cols-[1.1fr_.72fr] lg:gap-10 lg:pb-16">
        <div className="max-w-[47rem]">
          <motion.div {...reveal(0.05)} className="flex flex-wrap items-center gap-x-5 gap-y-3">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.025] px-3 py-2 text-xs text-zinc-300">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-accent opacity-50" />
                <span className="relative inline-flex size-2 rounded-full bg-accent" />
              </span>
              {site.availability}
            </span>
            <span className="inline-flex items-center gap-1.5 font-mono text-[0.68rem] uppercase tracking-[0.14em] text-zinc-600">
              <MapPin aria-hidden="true" size={13} /> {site.location}
            </span>
          </motion.div>
          <motion.p {...reveal(0.1)} className="mt-12 font-mono text-[0.68rem] uppercase tracking-[0.18em] text-accent">
            Software / Intelligence / Infrastructure
          </motion.p>
          <motion.h1 {...reveal(0.16)} className="display-title">
            Software Engineer building <span className="text-zinc-500">intelligent systems</span>
          </motion.h1>
          <motion.p {...reveal(0.24)} className="lede mt-8 max-w-[40rem]">
            {site.description}
          </motion.p>
          <motion.div {...reveal(0.3)} className="mt-9 flex flex-wrap gap-2.5">
            <Link href="/contact" className="button-primary">
              Contact me <ArrowUpRight aria-hidden="true" size={16} />
            </Link>
            <Link href="/projects" className="button-secondary">
              View my work <ArrowRight aria-hidden="true" size={16} />
            </Link>
            <a href={assets.resume} target="_blank" rel="noreferrer" className="button-secondary">
              View resume <ArrowUpRight aria-hidden="true" size={15} />
            </a>
          </motion.div>
          <motion.div {...reveal(0.36)} className="mt-10 flex items-center gap-4 border-t border-white/[0.08] pt-5 text-zinc-500">
            <a href={site.github} target="_blank" rel="noreferrer" aria-label="GitHub" className="grid size-9 place-items-center rounded-full border border-white/10 hover:border-white/20 hover:text-white"><BrandGithub size={16} /></a>
            <a href={site.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn" className="grid size-9 place-items-center rounded-full border border-white/10 hover:border-white/20 hover:text-white"><BrandLinkedIn size={16} /></a>
            <a href={`mailto:${site.email}`} aria-label="Email" className="grid size-9 place-items-center rounded-full border border-white/10 hover:border-white/20 hover:text-white"><Mail aria-hidden="true" size={16} /></a>
            <span className="ml-1 font-mono text-[0.64rem] uppercase tracking-[0.14em] text-zinc-700">Explore the work</span>
          </motion.div>
        </div>

        <motion.div {...reveal(0.22)} className="relative mx-auto w-full max-w-[29rem] lg:mr-0">
          <div className="absolute -inset-6 rounded-[3rem] bg-[radial-gradient(circle_at_50%_36%,rgba(156,183,231,.12),transparent_60%)] blur-xl" />
          <div className="surface relative aspect-[4/5] overflow-hidden rounded-[2.25rem]">
            <Image
              src={assets.portrait}
              alt="Portrait of Akhil Karthik Boddupalli"
              fill
              priority
              unoptimized={assets.portrait.startsWith("http")}
              sizes="(max-width: 1024px) 90vw, 29rem"
              className="object-cover object-[50%_28%] grayscale-[18%] contrast-[1.03] saturate-[.8]"
            />
            <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/90 via-black/45 to-transparent" />
            <div className="absolute inset-x-5 bottom-5 flex items-end justify-between gap-4">
              <div>
                <p className="font-mono text-[0.6rem] uppercase tracking-[0.16em] text-accent">Profile / 2026</p>
                <p className="mt-1.5 text-sm font-medium text-white">Akhil Karthik Boddupalli</p>
              </div>
              <span className="grid size-10 place-items-center rounded-full border border-white/20 bg-black/30 backdrop-blur-md"><ArrowDownRight aria-hidden="true" size={16} /></span>
            </div>
          </div>
          <motion.div
            aria-hidden="true"
            animate={{ rotate: visible && !reduceMotion ? 360 : 0 }}
            transition={{ duration: reduceMotion ? 0 : 36, repeat: reduceMotion ? 0 : Infinity, ease: "linear" }}
            className="absolute -right-7 -top-7 hidden size-24 rounded-full border border-dashed border-white/15 lg:block"
          />
        </motion.div>
      </div>
      <div aria-hidden="true" className="absolute bottom-0 left-1/2 h-px w-[min(90%,76rem)] -translate-x-1/2 bg-gradient-to-r from-transparent via-white/15 to-transparent" />
    </section>
  );
}

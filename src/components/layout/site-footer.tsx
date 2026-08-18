import { ArrowUpRight, Mail, MapPin } from "lucide-react";
import Link from "next/link";

import { ColophonDialog } from "@/components/layout/colophon-dialog";
import { site } from "@/content/site";
import { BrandGithub, BrandLinkedIn } from "@/components/ui/brand-icons";

export function SiteFooter() {
  return (
    <footer className="section-rule">
      <div className="section-shell grid gap-10 py-12 md:grid-cols-[1.2fr_.8fr] md:items-end">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.16em] text-accent">Akhil Karthik Boddupalli</p>
          <p className="mt-4 max-w-xl text-xl tracking-[-0.025em] text-zinc-300">
            Software engineering, intelligent systems and infrastructure — brought together with care.
          </p>
          <p className="mt-5 flex items-center gap-2 text-sm text-zinc-500">
            <MapPin aria-hidden="true" size={15} /> {site.location}
          </p>
        </div>
        <div className="flex flex-wrap gap-x-5 gap-y-3 text-sm text-zinc-400 md:justify-end">
          <a href={site.github} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 hover:text-white">
            <BrandGithub size={15} /> GitHub <ArrowUpRight aria-hidden="true" size={12} />
          </a>
          <a href={site.linkedin} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 hover:text-white">
            <BrandLinkedIn size={15} /> LinkedIn <ArrowUpRight aria-hidden="true" size={12} />
          </a>
          <a href={`mailto:${site.email}`} className="inline-flex items-center gap-1.5 hover:text-white">
            <Mail aria-hidden="true" size={15} /> Email
          </a>
          <Link href="/github" className="hover:text-white">GitHub page</Link>
        </div>
      </div>
      <div className="section-shell flex flex-col gap-2 border-t border-white/[0.07] py-5 font-mono text-[0.66rem] uppercase tracking-[0.14em] text-zinc-600 sm:flex-row sm:items-center sm:justify-between">
        <ColophonDialog />
        <span>© {new Date().getFullYear()} Akhil Karthik Boddupalli</span>
      </div>
    </footer>
  );
}

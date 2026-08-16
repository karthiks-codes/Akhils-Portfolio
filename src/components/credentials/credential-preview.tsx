import { ArrowRight, ArrowUpRight, Award, BadgeCheck, FileText } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { badges, certifications } from "@/content/credentials";

export function CredentialPreview() {
  return (
    <section id="certifications" className="section-rule scroll-mt-28">
      <div className="section-shell section-space">
        <Reveal><SectionHeading label="Credentials" title="Verified learning, presented with its proof." description="Formal certifications and digital badges are kept visibly separate. Every available proof and credential URL links to the real supplied source." /></Reveal>

        <div className="mt-14 grid gap-4 lg:grid-cols-[1.08fr_.92fr]">
          <Reveal className="surface rounded-[1.7rem] p-5 sm:p-7">
            <div className="flex items-center justify-between border-b border-white/10 pb-5"><div className="flex items-center gap-3"><Award aria-hidden="true" className="text-accent" size={19} /><h3 className="font-mono text-xs uppercase tracking-[0.16em]">Certifications</h3></div><span className="text-xs text-zinc-600">Formal</span></div>
            <div>
              {certifications.map((credential) => (
                <article key={credential.name} className="group border-b border-white/[0.08] py-6 last:border-0">
                  <div className="flex items-start justify-between gap-5"><div><p className="text-lg font-medium tracking-[-0.025em]">{credential.name}</p><p className="mt-2 text-sm text-zinc-500">{credential.issuer} · {credential.platform}</p></div><FileText aria-hidden="true" className="shrink-0 text-zinc-700 group-hover:text-accent" size={20} /></div>
                  <div className="mt-5 flex flex-wrap items-center justify-between gap-3"><span className="font-mono text-[0.62rem] uppercase tracking-[.14em] text-zinc-600">Completed {credential.date}</span><div className="flex gap-4"><a href={credential.proofFile} target="_blank" rel="noreferrer" className="button-quiet text-xs">Proof <ArrowUpRight aria-hidden="true" size={12} /></a><a href={credential.credentialUrl} target="_blank" rel="noreferrer" className="button-quiet text-xs">Verify <ArrowUpRight aria-hidden="true" size={12} /></a></div></div>
                </article>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.05} className="surface overflow-hidden rounded-[1.7rem] p-5 sm:p-7">
            <div className="flex items-center justify-between border-b border-white/10 pb-5"><div className="flex items-center gap-3"><BadgeCheck aria-hidden="true" className="text-accent" size={19} /><h3 className="font-mono text-xs uppercase tracking-[0.16em]">Digital Badges</h3></div><span className="text-xs text-zinc-600">Verified</span></div>
            <div className="mt-6 grid grid-cols-2 gap-3">
              {badges.map((badge) => (
                <a key={badge.name} href={badge.credentialUrl} target="_blank" rel="noreferrer" aria-label={`Verify ${badge.name}`} className="group rounded-2xl border border-white/[0.08] bg-black/15 p-3 transition-colors hover:border-white/20">
                  <div className="relative mx-auto aspect-square w-full max-w-[8rem]"><Image src={badge.badgeImage!} alt={`${badge.name} digital badge`} fill unoptimized={badge.badgeImage!.startsWith("http")} sizes="8rem" className="object-contain transition-transform duration-300 group-hover:scale-[1.03]" /></div>
                  <p className="mt-3 line-clamp-2 text-xs leading-5 text-zinc-400 group-hover:text-white">{badge.name}</p>
                </a>
              ))}
            </div>
          </Reveal>
        </div>
        <Reveal className="mt-7 flex justify-end"><Link href="/certifications" className="button-secondary">Explore all credentials <ArrowRight aria-hidden="true" size={15} /></Link></Reveal>
      </div>
    </section>
  );
}

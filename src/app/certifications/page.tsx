import type { Metadata } from "next";
import { ArrowUpRight, BadgeCheck, FileText } from "lucide-react";
import Image from "next/image";

import { PageIntro } from "@/components/ui/page-intro";
import { badges, certifications } from "@/content/credentials";

export const metadata: Metadata = {
  title: "Certifications & Digital Badges",
  description: "Verified formal certifications and separately presented digital badges earned by Akhil Karthik Boddupalli.",
  alternates: { canonical: "/certifications" },
};

export default function CertificationsPage() {
  return (
    <>
      <PageIntro label="Credentials" title="Proof you can inspect." description="Formal certifications and digital badges are different evidence. This page keeps them separate and connects each available official proof and verification source." />
      <section className="section-rule"><div className="section-shell section-space !pt-14"><div className="flex items-center gap-3"><FileText aria-hidden="true" className="text-accent" size={19} /><p className="eyebrow before:hidden">Certifications</p></div><h2 className="mt-5 text-4xl font-medium tracking-[-.05em]">Formal certifications</h2><div className="mt-10 grid gap-5 lg:grid-cols-2">{certifications.map((credential) => <article key={credential.name} className="surface overflow-hidden rounded-[1.7rem]"><div className="aspect-[1.294/1] overflow-hidden border-b border-white/10 bg-white"><iframe src={`${credential.proofFile}#page=1&toolbar=0&navpanes=0&scrollbar=0`} loading="lazy" title={`${credential.name} certificate preview`} className="h-full w-full border-0" /></div><div className="p-6"><p className="font-mono text-[.62rem] uppercase tracking-[.15em] text-accent">{credential.issuer} · {credential.platform}</p><h3 className="mt-3 text-2xl font-medium tracking-[-.035em]">{credential.name}</h3><p className="mt-2 text-sm text-zinc-500">Completed {credential.date}</p><div className="mt-6 flex flex-wrap gap-2"><a href={credential.proofFile} target="_blank" rel="noreferrer" className="button-secondary">Open proof <ArrowUpRight aria-hidden="true" size={14} /></a><a href={credential.credentialUrl} target="_blank" rel="noreferrer" className="button-primary">Verify <ArrowUpRight aria-hidden="true" size={14} /></a></div></div></article>)}</div></div></section>
      <section className="section-rule bg-white/[.012]"><div className="section-shell section-space"><div className="flex items-center gap-3"><BadgeCheck aria-hidden="true" className="text-accent" size={19} /><p className="eyebrow before:hidden">Digital badges</p></div><h2 className="mt-5 text-4xl font-medium tracking-[-.05em]">Verified skills, visibly separate.</h2><p className="mt-4 max-w-2xl text-sm leading-6 text-zinc-500">These are digital badges, not formal certifications.</p><div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{badges.map((badge) => <article key={badge.name} className="surface flex flex-col rounded-[1.5rem] p-5"><div className="relative mx-auto aspect-square w-full max-w-[11rem]"><Image src={badge.badgeImage!} alt={`${badge.name} digital badge`} fill unoptimized={badge.badgeImage!.startsWith("http")} sizes="11rem" className="object-contain" /></div><p className="mt-5 font-mono text-[.6rem] uppercase tracking-[.14em] text-accent">{badge.issuer} · Digital badge</p><h3 className="mt-3 text-base font-medium leading-6">{badge.name}</h3>{badge.date ? <p className="mt-2 text-xs text-zinc-600">Issued {badge.date}</p> : null}<div className="mt-auto flex flex-wrap gap-x-4 gap-y-2 pt-6">{badge.proofFile ? <a href={badge.proofFile} target="_blank" rel="noreferrer" className="button-quiet text-xs">Proof <ArrowUpRight aria-hidden="true" size={12} /></a> : null}<a href={badge.credentialUrl} target="_blank" rel="noreferrer" className="button-quiet text-xs">Verify <ArrowUpRight aria-hidden="true" size={12} /></a></div></article>)}</div></div></section>
    </>
  );
}

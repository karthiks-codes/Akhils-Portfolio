import type { Metadata } from "next";
import { Mail, MapPin, Phone } from "lucide-react";

import { ContactForm } from "@/components/forms/contact-form";
import { PageIntro } from "@/components/ui/page-intro";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact Akhil Karthik Boddupalli about software engineering, AI/ML, cloud and DevOps opportunities.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <>
      <PageIntro label="Contact" title="Start with a good problem." description={`${site.availability} Share the opportunity, idea or technical challenge — concise is fine.`} />
      <section className="section-rule"><div className="section-shell section-space !pt-14"><div className="grid gap-10 lg:grid-cols-[.65fr_1.35fr]"><aside className="space-y-3 text-sm text-zinc-500"><a href={`mailto:${site.email}`} className="flex items-center gap-3 rounded-xl border border-white/10 px-4 py-3.5 hover:border-white/20 hover:text-white"><Mail aria-hidden="true" size={16} />{site.email}</a><a href={`tel:${site.phone.replace(/\s/g, "")}`} className="flex items-center gap-3 rounded-xl border border-white/10 px-4 py-3.5 hover:border-white/20 hover:text-white"><Phone aria-hidden="true" size={16} />{site.phone}</a><p className="flex items-center gap-3 rounded-xl border border-white/10 px-4 py-3.5"><MapPin aria-hidden="true" size={16} />{site.location}</p><p className="pt-4 text-xs leading-5 text-zinc-600">The form sends Akhil a notification and sends you an acknowledgment only after successful delivery.</p></aside><div className="surface rounded-[1.75rem] p-5 sm:p-8 lg:p-10"><ContactForm /></div></div></div></section>
    </>
  );
}

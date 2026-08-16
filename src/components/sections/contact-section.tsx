import { Mail, MapPin, Phone } from "lucide-react";

import { ContactForm } from "@/components/forms/contact-form";
import { Reveal } from "@/components/ui/reveal";
import { site } from "@/content/site";

export function ContactSection() {
  return (
    <section id="contact" className="section-rule scroll-mt-28">
      <div className="section-shell section-space">
        <Reveal className="grid gap-12 lg:grid-cols-[.75fr_1.25fr] lg:gap-16">
          <div><p className="eyebrow">Contact</p><h2 className="section-title">Let’s build something worth shipping.</h2><p className="lede mt-6">{site.availability} If the work sits somewhere between software, AI and infrastructure, I’d like to hear about it.</p><div className="mt-9 space-y-3 text-sm text-zinc-500"><a href={`mailto:${site.email}`} className="flex items-center gap-3 hover:text-white"><Mail aria-hidden="true" size={16} />{site.email}</a><a href={`tel:${site.phone.replace(/\s/g, "")}`} className="flex items-center gap-3 hover:text-white"><Phone aria-hidden="true" size={16} />{site.phone}</a><p className="flex items-center gap-3"><MapPin aria-hidden="true" size={16} />{site.location}</p></div></div>
          <div className="surface rounded-[1.75rem] p-5 sm:p-8"><ContactForm /></div>
        </Reveal>
      </div>
    </section>
  );
}

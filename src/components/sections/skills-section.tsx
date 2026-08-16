import { SkillsMap } from "@/components/sections/skills-map";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";

export function SkillsSection() {
  return (
    <section id="skills" className="section-shell section-space scroll-mt-28">
      <Reveal><SectionHeading label="Technical skills" title="A broad toolkit, organized around how systems are built." description="These are areas of technical work and interest — not arbitrary proficiency scores. Select a domain to explore the map." /></Reveal>
      <Reveal delay={0.06}><SkillsMap /></Reveal>
    </section>
  );
}

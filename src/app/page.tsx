import { AboutSection } from "@/components/sections/about-section";
import { ContactSection } from "@/components/sections/contact-section";
import { EducationSection } from "@/components/sections/education-section";
import { GithubPreview } from "@/components/sections/github-preview";
import { Hero } from "@/components/sections/hero";
import { LeadershipSection } from "@/components/sections/leadership-section";
import { ProjectsSection } from "@/components/sections/projects-section";
import { SkillsSection } from "@/components/sections/skills-section";
import { ToolsSection } from "@/components/sections/tools-section";
import { CredentialPreview } from "@/components/credentials/credential-preview";

export default function HomePage() {
  return (
    <>
      <Hero />
      <AboutSection />
      <EducationSection />
      <CredentialPreview />
      <LeadershipSection />
      <SkillsSection />
      <ToolsSection />
      <ProjectsSection />
      <GithubPreview />
      <ContactSection />
    </>
  );
}

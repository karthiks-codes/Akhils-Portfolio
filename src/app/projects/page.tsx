import type { Metadata } from "next";

import { ProjectFilter } from "@/components/projects/project-filter";
import { PageIntro } from "@/components/ui/page-intro";
import { projects } from "@/content/projects";

export const metadata: Metadata = {
  title: "Projects",
  description: "Explore Akhil Karthik Boddupalli's approved software, AI/ML, cloud, automation and research projects.",
  alternates: { canonical: "/projects" },
};

export default function ProjectsPage() {
  return (
    <>
      <PageIntro label="Project index" title="Built, researched and still being shaped." description="Seven approved projects. No invented repositories, demos, screenshots or performance metrics — only the technical material that is actually supported." />
      <section className="section-rule">
        <div className="section-shell section-space !pt-12">
          <ProjectFilter projects={projects} />
        </div>
      </section>
    </>
  );
}

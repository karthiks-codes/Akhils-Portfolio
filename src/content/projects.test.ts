import { describe, expect, it } from "vitest";

import { featuredProjects, ongoingProjects, projects } from "@/content/projects";
import { projectCategories } from "@/types/content";

describe("portfolio project data", () => {
  it("contains exactly the seven approved projects", () => {
    expect(projects.map((project) => project.title)).toEqual([
      "SmartSkin",
      "Personalized News Recommendation System",
      "NeuroTrace",
      "House Rental Application",
      "TripShield",
      "Job Automation",
      "Technical Portfolio Website",
    ]);
  });

  it("keeps the approved featured and ongoing sets exact", () => {
    expect(featuredProjects.map((project) => project.title)).toEqual([
      "SmartSkin",
      "Personalized News Recommendation System",
      "NeuroTrace",
    ]);
    expect(ongoingProjects.map((project) => project.title)).toEqual([
      "TripShield",
      "Job Automation",
      "Technical Portfolio Website",
    ]);
  });

  it("uses only the approved filter taxonomy", () => {
    expect(projectCategories).toEqual([
      "All",
      "AI / ML",
      "Full Stack",
      "Cloud & DevOps",
      "Automation",
      "Vibe Coding",
      "Research",
    ]);
    const approved = new Set(projectCategories);
    expect(projects.every((project) => project.categories.every((category) => approved.has(category)))).toBe(true);
  });

  it("does not claim current TripShield implementation", () => {
    const tripShield = projects.find((project) => project.slug === "tripshield");
    expect(tripShield?.implementation).toEqual([]);
    expect(tripShield?.planned?.length).toBeGreaterThan(0);
    expect(tripShield?.resultNote).toContain("design targets");
  });
});

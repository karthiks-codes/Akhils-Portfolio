import type { MetadataRoute } from "next";

import { projects } from "@/content/projects";
import { getSiteUrl } from "@/lib/env";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getSiteUrl();
  const routes = ["", "/projects", "/certifications", "/github", "/contact"];
  return [...routes, ...projects.map((project) => `/projects/${project.slug}`)].map((route) => ({
    url: new URL(route || "/", base).toString(),
    changeFrequency: route.startsWith("/projects/") ? "monthly" : "weekly",
    priority: route === "" ? 1 : route === "/projects" ? 0.9 : 0.7,
  }));
}

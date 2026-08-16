export const projectCategories = [
  "All",
  "AI / ML",
  "Full Stack",
  "Cloud & DevOps",
  "Automation",
  "Vibe Coding",
  "Research",
] as const;

export type ProjectCategory = Exclude<(typeof projectCategories)[number], "All">;
export type ProjectStatus = "completed" | "ongoing";

export type Project = {
  slug: string;
  title: string;
  subtitle: string;
  shortDescription: string;
  longDescription: string;
  status: ProjectStatus;
  featured: boolean;
  categories: ProjectCategory[];
  technologies: string[];
  problem: string;
  implementation: string[];
  pipeline?: string[];
  planned?: string[];
  evidenceNote?: string;
  resultNote?: string;
  githubUrl?: string;
  demoUrl?: string;
  documentationUrl?: string;
  paperUrl?: string;
  images?: string[];
  architectureImage?: string;
};

export type Credential = {
  name: string;
  issuer: string;
  platform?: string;
  type: "certification" | "badge";
  category: string;
  date?: string;
  credentialUrl: string;
  proofFile?: string;
  badgeImage?: string;
};

export type SocialLink = {
  name: "GitHub" | "LinkedIn" | "Credly" | "Email";
  url: string;
  visible: boolean;
};

export type SkillGroup = {
  name: string;
  description: string;
  skills: string[];
};

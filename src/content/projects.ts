import type { Project } from "@/types/content";

export const projects: Project[] = [
  {
    slug: "smartskin",
    title: "SmartSkin",
    subtitle: "Skincare Compatibility System",
    shortDescription:
      "A skincare compatibility system that evaluates product ingredients against skin type and supports more personal skincare routines.",
    longDescription:
      "SmartSkin connects an ML-assisted compatibility workflow to a practical web interface. It analyses product ingredients and a user's skin type, predicts suitability, and presents the result in a form designed to support routine decisions.",
    status: "completed",
    featured: true,
    categories: ["AI / ML", "Full Stack", "Cloud & DevOps"],
    technologies: ["Python", "Machine Learning", "React", "REST APIs", "Docker", "Kubernetes", "Git"],
    problem:
      "Skincare labels are dense and product suitability is personal. SmartSkin explores how a structured compatibility model can make those choices easier to reason about.",
    implementation: [
      "A Python-based machine-learning workflow predicts product suitability and compatibility.",
      "A React interface exposes the analysis and supports personalized routine visualization.",
      "The frontend and backend communicate through a REST API.",
      "The application was containerized with Docker and used for Kubernetes-based local deployment experimentation.",
    ],
  },
  {
    slug: "personalized-news",
    title: "Personalized News Recommendation System",
    subtitle: "Semantic news discovery shaped around the reader",
    shortDescription:
      "A news recommendation pipeline using text embeddings, topic clustering, preferences and semantic similarity.",
    longDescription:
      "The system transforms article text into sentence embeddings, organizes the corpus into topic clusters, and compares content against mood and interest profiles to produce personalized recommendations.",
    status: "completed",
    featured: true,
    categories: ["AI / ML"],
    technologies: [
      "Python",
      "NLP",
      "Sentence Transformers",
      "Web Scraping",
      "Machine Learning",
      "K-Means",
      "Cosine Similarity",
    ],
    problem:
      "A general news feed treats every reader the same. This project investigates how semantic representation and lightweight preference profiles can make discovery more relevant.",
    implementation: [
      "Articles were collected from Indian Express pages with titles, descriptions and metadata.",
      "Sentence Transformers convert article text into dense semantic embeddings.",
      "K-Means groups articles into topic regions before recommendation.",
      "User interest and mood profiles are compared to content with cosine similarity.",
    ],
    pipeline: [
      "Indian Express articles",
      "Titles, descriptions & metadata",
      "Sentence embeddings",
      "K-Means topic clustering",
      "Interest & mood profiles",
      "Cosine similarity",
      "Recommendations",
    ],
  },
  {
    slug: "neurotrace",
    title: "NeuroTrace",
    subtitle: "Explainable deep learning for brain-tumor segmentation",
    shortDescription:
      "A 3D medical-image segmentation framework combining Attention U-Net with GNN-driven attention, explainability and uncertainty estimation.",
    longDescription:
      "NeuroTrace explores brain-tumor segmentation on the BraTS 2023 glioma dataset. The principal architecture is a 3D Attention U-Net with GNN-driven attention at the bottleneck, supported by qualitative explainability and uncertainty work.",
    status: "completed",
    featured: true,
    categories: ["AI / ML", "Research"],
    technologies: [
      "3D Deep Learning",
      "Medical Image Segmentation",
      "Graph Neural Networks",
      "Grad-CAM",
      "Monte Carlo Dropout",
      "Uncertainty Estimation",
    ],
    problem:
      "Brain-tumor segmentation is spatially complex and clinically sensitive. The work focuses on a volumetric segmentation pipeline while also making model attention and uncertainty more inspectable.",
    implementation: [
      "A 3D Attention U-Net forms the principal segmentation architecture.",
      "The bottleneck uses GNN-based, GNN-driven attention rather than Transformer attention.",
      "Inputs use patch cropping and z-score normalization on the BraTS 2023 glioma dataset.",
      "Training used combined Cross-Entropy and Dice loss with Adam at a learning rate around 1e-4.",
      "Grad-CAM and Monte Carlo Dropout support qualitative explainability and uncertainty exploration.",
    ],
    pipeline: [
      "BraTS 2023 volumes",
      "Patch cropping",
      "Z-score normalization",
      "3D Attention U-Net",
      "GNN-driven bottleneck attention",
      "Segmentation output",
      "Explainability & uncertainty views",
    ],
    evidenceNote:
      "Known training context includes patches around 100 × 100 × 60, an RTX 3060 Laptop GPU and approximately 25–50 epochs.",
    resultNote:
      "Qualitative segmentation material exists. No quantitative performance metrics are claimed here, and the uncertainty and explainability modules were not evaluated to the same extent as the main segmentation implementation.",
  },
  {
    slug: "house-rental",
    title: "House Rental Application",
    subtitle: "A concise full-stack rental workflow",
    shortDescription:
      "A Java and SQL application for working through the core data flows of a house-rental experience.",
    longDescription:
      "A compact full-stack application built to explore the data and interface concerns of a house-rental workflow.",
    status: "completed",
    featured: false,
    categories: ["Full Stack"],
    technologies: ["Java", "SQL", "Java Applet"],
    problem:
      "Rental software brings together listings, user-facing interaction and persistent data. This project provided a practical setting for connecting those layers.",
    implementation: [
      "The application uses Java for its core implementation.",
      "SQL provides the relational data layer.",
      "A Java Applet supplies the user-facing interface.",
    ],
    evidenceNote: "No screenshots, repository, demo or extended documentation have been supplied yet.",
  },
  {
    slug: "tripshield",
    title: "TripShield",
    subtitle: "Autonomous Travel-Disruption Concierge",
    shortDescription:
      "An ongoing proposal for detecting travel disruption and coordinating bounded, whole-trip recovery rather than only sending alerts.",
    longDescription:
      "TripShield is an ongoing travel-disruption concept. Supplied proposal material describes a WATCH → NOTICE → REPAIR → REASSURE workflow, but the current implementation state has not been supplied and is intentionally not represented as complete.",
    status: "ongoing",
    featured: false,
    categories: ["AI / ML", "Full Stack", "Cloud & DevOps"],
    technologies: [
      "React Native",
      "Node.js",
      "Express",
      "LangGraph",
      "PostgreSQL",
      "Redis",
      "AWS",
      "OAuth2",
    ],
    problem:
      "Travel disruption is usually communicated as a notification even when it affects several linked trip components. TripShield proposes a bounded system that reasons about the wider trip and coordinates recovery options.",
    implementation: [],
    pipeline: ["Watch", "Notice", "Repair", "Reassure"],
    planned: [
      "A React Native member experience connected through an API gateway and authentication layer.",
      "A business-logic and AI engine organized around Watcher, Impact Analyser, Option Engine, Policy Engine and Executor roles.",
      "PostgreSQL and Redis data services plus provider adapters for external travel and communication APIs.",
      "Bounded-autonomy controls including deterministic money decisions, idempotent booking requests, circuit breaking and an audit trail.",
    ],
    evidenceNote:
      "Proposal evidence only: no current frontend, backend, agent logic, database, deployment or end-to-end implementation has been confirmed.",
    resultNote:
      "The proposal defines latency, recovery and autonomy goals. They are design targets, not measured results, and are therefore not presented as project outcomes.",
  },
  {
    slug: "job-automation",
    title: "Job Automation",
    subtitle: "A structured job-post intake and application workflow",
    shortDescription:
      "An ongoing automation concept for parsing Telegram job posts, structuring opportunities and preparing application actions.",
    longDescription:
      "The proposed workflow turns an incoming job post into a structured application record: classify its application route, extract useful fields, store the result, generate an email and coordinate sending.",
    status: "ongoing",
    featured: false,
    categories: ["Automation"],
    technologies: ["n8n", "RAG", "OpenRouter", "Telegram", "Google Docs", "Email Automation"],
    problem:
      "Job opportunities arrive in inconsistent formats and often require the same extraction and preparation steps. The project explores a repeatable workflow around that information.",
    implementation: [],
    pipeline: [
      "Telegram job posts",
      "Parse job post",
      "Classify application type",
      "Extract company, role, skills & route",
      "Store in master document",
      "Generate application email",
      "Coordinate sending",
    ],
    planned: [
      "Classify each opportunity as email, Google Form, job portal or unknown.",
      "Extract company, role, skills, HR email and application URL where present.",
      "Use resume, LinkedIn and project knowledge to support application generation.",
    ],
    evidenceNote:
      "The source material describes the intended workflow and technologies under consideration. Individual features are not marked as implemented without further confirmation.",
  },
  {
    slug: "technical-portfolio",
    title: "Technical Portfolio Website",
    subtitle: "A personal developer workspace on the web",
    shortDescription:
      "An ongoing portfolio built to present software engineering, AI/ML, cloud and DevOps work with factual technical depth.",
    longDescription:
      "This portfolio is designed as a serious technical product: typed local content, deep project routes, real credential proof, secured contact flows and a restrained visual system shaped with ChatGPT and Codex assistance.",
    status: "ongoing",
    featured: false,
    categories: ["Vibe Coding", "Full Stack"],
    technologies: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Motion", "MongoDB", "Resend", "Cloudflare"],
    problem:
      "A developer portfolio needs to balance immediate recruiter readability with enough technical depth to reward exploration, without inflating incomplete work or fabricating evidence.",
    implementation: [
      "A Next.js App Router application with typed local content and statically generated project routes.",
      "Responsive interface components built with React, TypeScript and a token-led Tailwind design system.",
      "Server-side submission adapters prepared for Resend, MongoDB Atlas and Cloudflare Turnstile.",
      "Accessibility, component and critical-flow verification integrated into the repository.",
    ],
    planned: [
      "Connect production provider credentials and a public deployment when accounts are authorized.",
      "Add confirmed project screenshots and resource links as they become available.",
    ],
    evidenceNote:
      "ChatGPT and Codex assisted development. No public repository, deployment URL or project media is claimed until supplied.",
  },
];

export const featuredProjects = projects.filter((project) => project.featured);
export const ongoingProjects = projects.filter((project) => project.status === "ongoing");

export function getProject(slug: string) {
  return projects.find((project) => project.slug === slug);
}

export function getRelatedProjects(project: Project) {
  return projects
    .filter(
      (candidate) =>
        candidate.slug !== project.slug &&
        candidate.categories.some((category) => project.categories.includes(category)),
    )
    .slice(0, 3);
}

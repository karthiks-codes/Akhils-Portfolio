import { assets } from "@/lib/assets/manifest";
import type { Credential } from "@/types/content";

export const certifications: Credential[] = [
  {
    name: "Google Cybersecurity Professional Certificate",
    issuer: "Google",
    platform: "Coursera",
    type: "certification",
    category: "Cybersecurity",
    date: "August 24, 2025",
    credentialUrl: "https://coursera.org/share/353b80edd5e8991659b035d1c31fef06",
    proofFile: assets.credentials.googleCybersecurity,
  },
  {
    name: "Financial Markets",
    issuer: "Yale University",
    platform: "Coursera",
    type: "certification",
    category: "Finance",
    date: "August 28, 2024",
    credentialUrl: "https://coursera.org/share/2bf606e4309c72fa6dfb81031bc1f641",
    proofFile: assets.credentials.yaleFinancialMarkets,
  },
];

export const badges: Credential[] = [
  {
    name: "AI Skills Fest 2026",
    issuer: "Microsoft",
    type: "badge",
    category: "Artificial Intelligence",
    credentialUrl: "https://www.credly.com/badges/826d4b13-cc4d-46ce-9276-bbd2c7d31a5c/public_url",
    badgeImage: assets.credentials.microsoftAiSkillsFest,
  },
  {
    name: "MongoDB Overview: Core Concepts and Architecture",
    issuer: "MongoDB",
    type: "badge",
    category: "Database",
    date: "August 3, 2026",
    credentialUrl: "https://www.credly.com/badges/110caff1-c3c9-424a-a946-9e58cb75b6e8/public_url",
    badgeImage: assets.credentials.mongodbOverviewBadge,
    proofFile: assets.credentials.mongodbOverviewProof,
  },
  {
    name: "From Relational Model (SQL) to MongoDB's Document Model",
    issuer: "MongoDB",
    type: "badge",
    category: "Database",
    date: "August 6, 2026",
    credentialUrl: "https://www.credly.com/badges/e493fe44-0435-4c5d-be7e-9546cee6309a/public_url",
    badgeImage: assets.credentials.mongodbRelationalBadge,
    proofFile: assets.credentials.mongodbRelationalProof,
  },
  {
    name: "MongoDB Schema Design Patterns and Anti-patterns Skill Badge",
    issuer: "MongoDB",
    type: "badge",
    category: "Database",
    date: "August 14, 2026",
    credentialUrl: "https://www.credly.com/badges/1bc5e160-f3c7-457e-9f70-a9237ac95d9d/public_url",
    badgeImage: assets.credentials.mongodbSchemaBadge,
    proofFile: assets.credentials.mongodbSchemaProof,
  },

];

const localAssets = {
  portrait: "/assets/personal/profile/akhil-karthik-boddupalli-profile.png",
  resume: "/assets/personal/resume/akhil-karthik-boddupalli-resume.pdf",
  credentials: {
    googleCybersecurity:
      "/assets/credentials/certifications/google/google-cybersecurity-professional-certificate.pdf",
    yaleFinancialMarkets:
      "/assets/credentials/certifications/yale/yale-financial-markets-certificate.pdf",
    microsoftAiSkillsFest:
      "/assets/credentials/badges/microsoft/microsoft-ai-skills-fest-2026-badge.png",
    mongodbOverviewBadge:
      "/assets/credentials/badges/mongodb/mongodb-overview-core-concepts-and-architecture-badge.png",
    mongodbOverviewProof:
      "/assets/credentials/badges/mongodb/mongodb-overview-core-concepts-and-architecture-proof.pdf",
    mongodbRelationalBadge:
      "/assets/credentials/badges/mongodb/mongodb-from-relational-model-sql-to-document-model-badge.png",
    mongodbRelationalProof:
      "/assets/credentials/badges/mongodb/mongodb-from-relational-model-sql-to-document-model-proof.pdf",
    mongodbSchemaBadge:
      "/assets/credentials/badges/mongodb/mongodb-schema-design-patterns-and-anti-patterns-skill-badge.png",
    mongodbSchemaProof:
      "/assets/credentials/badges/mongodb/mongodb-schema-design-patterns-and-anti-patterns-skill-proof.pdf",
    mongodbCrudBadge:
      "/assets/credentials/badges/mongodb/mongodb-crud-operations-badge.png",
    mongodbCrudProof:
      "/assets/credentials/badges/mongodb/mongodb-crud-operations-proof.pdf",
    mongodbIndexingBadge:
      "/assets/credentials/badges/mongodb/mongodb-indexing-design-fundamentals-badge.png",
    mongodbIndexingProof:
      "/assets/credentials/badges/mongodb/mongodb-indexing-design-fundamentals-proof.pdf",
    mongodbVectorSearchBadge:
      "/assets/credentials/badges/mongodb/mongodb-building-ai-powered-search-with-mongodb-vector-search-badge.png",
    mongodbVectorSearchProof:
      "/assets/credentials/badges/mongodb/mongodb-building-ai-powered-search-with-mongodb-vector-search-proof.pdf",
    

  },
} as const;

export function resolveAssetUrl(localPath: string) {
  const base = process.env.NEXT_PUBLIC_ASSET_BASE_URL?.replace(/\/$/, "");
  return base ? `${base}${localPath}` : localPath;
}

export const assets = {
  portrait: resolveAssetUrl(localAssets.portrait),
  resume: resolveAssetUrl(localAssets.resume),
  credentials: Object.fromEntries(
    Object.entries(localAssets.credentials).map(([key, path]) => [key, resolveAssetUrl(path)]),
  ) as { [K in keyof typeof localAssets.credentials]: string },
};

export { localAssets };

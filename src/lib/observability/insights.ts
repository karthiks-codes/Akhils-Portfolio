import "server-only";

import type { Collection } from "mongodb";

import { localAssets } from "@/lib/assets/manifest";
import { getAuthConfig, readServerEnv } from "@/lib/env";
import { getMongoClient } from "@/lib/mongodb/client";
import type { SubmissionRecord } from "@/lib/mongodb/submissions";

export type ServiceState = "operational" | "degraded" | "not_configured";

export type ServiceCheck = {
  id: string;
  label: string;
  state: ServiceState;
  detail: string;
  latencyMs?: number;
};

export type RecentSubmission = Pick<
  SubmissionRecord,
  "_id" | "type" | "projectName" | "createdAt" | "deliveryStatus"
>;

type CollectionSnapshot = {
  total: number;
  last24Hours: number;
  last7Days: number;
  last30Days: number;
  statuses: Record<string, number>;
  recent: RecentSubmission[];
};

export type InsightsSnapshot = {
  generatedAt: string;
  release: string;
  environment: string;
  submissions: CollectionSnapshot & {
    available: boolean;
    contacts: number;
    suggestions: number;
  };
  services: ServiceCheck[];
};

const emptyCollection: CollectionSnapshot = {
  total: 0,
  last24Hours: 0,
  last7Days: 0,
  last30Days: 0,
  statuses: {},
  recent: [],
};

async function collectionSnapshot(
  target: Collection<SubmissionRecord>,
  fallbackType: SubmissionRecord["type"],
): Promise<CollectionSnapshot> {
  const now = Date.now();
  const dayAgo = new Date(now - 24 * 60 * 60 * 1_000);
  const weekAgo = new Date(now - 7 * 24 * 60 * 60 * 1_000);
  const monthAgo = new Date(now - 30 * 24 * 60 * 60 * 1_000);
  const [total, last24Hours, last7Days, last30Days, statusRows, recentRows] = await Promise.all([
    target.countDocuments(),
    target.countDocuments({ createdAt: { $gte: dayAgo } }),
    target.countDocuments({ createdAt: { $gte: weekAgo } }),
    target.countDocuments({ createdAt: { $gte: monthAgo } }),
    target.aggregate<{ _id: string; count: number }>([
      { $group: { _id: "$deliveryStatus", count: { $sum: 1 } } },
    ]).toArray(),
    target
      .find(
        {},
        { projection: { _id: 1, type: 1, projectName: 1, createdAt: 1, deliveryStatus: 1 } },
      )
      .sort({ createdAt: -1 })
      .limit(6)
      .toArray(),
  ]);

  return {
    total,
    last24Hours,
    last7Days,
    last30Days,
    statuses: Object.fromEntries(statusRows.map((row) => [row._id || "unknown", row.count])),
    recent: recentRows.map((record) => ({
      _id: record._id,
      type: record.type ?? fallbackType,
      projectName: record.projectName,
      createdAt: record.createdAt,
      deliveryStatus: record.deliveryStatus,
    })),
  };
}

function combineCollections(contact: CollectionSnapshot, suggestion: CollectionSnapshot) {
  const statusNames = new Set([...Object.keys(contact.statuses), ...Object.keys(suggestion.statuses)]);
  return {
    total: contact.total + suggestion.total,
    contacts: contact.total,
    suggestions: suggestion.total,
    last24Hours: contact.last24Hours + suggestion.last24Hours,
    last7Days: contact.last7Days + suggestion.last7Days,
    last30Days: contact.last30Days + suggestion.last30Days,
    statuses: Object.fromEntries(
      [...statusNames].map((status) => [status, (contact.statuses[status] ?? 0) + (suggestion.statuses[status] ?? 0)]),
    ),
    recent: [...contact.recent, ...suggestion.recent]
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, 8),
  };
}

async function probeCdn(): Promise<ServiceCheck> {
  const base = process.env.NEXT_PUBLIC_ASSET_BASE_URL?.replace(/\/$/, "");
  if (!base) {
    return {
      id: "assets",
      label: "Asset delivery",
      state: "operational",
      detail: "Canonical local assets are active.",
    };
  }

  const startedAt = Date.now();
  try {
    const response = await fetch(`${base}${localAssets.portrait}`, {
      method: "HEAD",
      cache: "no-store",
      signal: AbortSignal.timeout(4_000),
    });
    return {
      id: "assets",
      label: "Cloudflare R2",
      state: response.ok ? "operational" : "degraded",
      detail: response.ok ? "Canonical portrait object is reachable." : `Asset probe returned HTTP ${response.status}.`,
      latencyMs: Date.now() - startedAt,
    };
  } catch {
    return {
      id: "assets",
      label: "Cloudflare R2",
      state: "degraded",
      detail: "Asset probe did not complete.",
      latencyMs: Date.now() - startedAt,
    };
  }
}

export async function getInsightsSnapshot(): Promise<InsightsSnapshot> {
  const parsed = readServerEnv();
  const env = parsed.success ? parsed.data : undefined;
  const authConfig = getAuthConfig();
  let databaseCheck: ServiceCheck;
  let contact = emptyCollection;
  let suggestion = emptyCollection;
  let submissionsAvailable = false;

  if (!env?.MONGODB_URI) {
    databaseCheck = {
      id: "mongodb",
      label: "MongoDB Atlas",
      state: "not_configured",
      detail: "Submission persistence is not configured.",
    };
  } else {
    const startedAt = Date.now();
    try {
      const client = getMongoClient(env.MONGODB_URI);
      if (!client) throw new Error("MongoDB client unavailable");
      const db = (await client).db(env.MONGODB_DB_NAME);
      await db.command({ ping: 1 });
      [contact, suggestion] = await Promise.all([
        collectionSnapshot(db.collection<SubmissionRecord>("contact_submissions"), "contact"),
        collectionSnapshot(db.collection<SubmissionRecord>("project_suggestions"), "suggestion"),
      ]);
      submissionsAvailable = true;
      databaseCheck = {
        id: "mongodb",
        label: "MongoDB Atlas",
        state: "operational",
        detail: "Connected and submission summaries loaded.",
        latencyMs: Date.now() - startedAt,
      };
    } catch {
      databaseCheck = {
        id: "mongodb",
        label: "MongoDB Atlas",
        state: "degraded",
        detail: "Database probe or summary query failed.",
        latencyMs: Date.now() - startedAt,
      };
    }
  }

  const combined = combineCollections(contact, suggestion);
  const services = await Promise.all([
    Promise.resolve(databaseCheck),
    probeCdn(),
    Promise.resolve<ServiceCheck>({
      id: "resend",
      label: "Resend delivery",
      state: env?.RESEND_API_KEY && env.CONTACT_FROM_EMAIL ? "operational" : "not_configured",
      detail:
        env?.RESEND_API_KEY && env.CONTACT_FROM_EMAIL
          ? "Email delivery credentials are configured."
          : "Email delivery credentials are incomplete.",
    }),
    Promise.resolve<ServiceCheck>({
      id: "resend-webhook",
      label: "Resend webhook",
      state: env?.RESEND_WEBHOOK_SECRET ? "operational" : "not_configured",
      detail: env?.RESEND_WEBHOOK_SECRET
        ? "Signed delivery events can be processed."
        : "Delivery-event tracking is not configured.",
    }),
    Promise.resolve<ServiceCheck>({
      id: "turnstile",
      label: "Cloudflare Turnstile",
      state:
        process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY && env?.TURNSTILE_SECRET_KEY
          ? "operational"
          : "not_configured",
      detail:
        process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY && env?.TURNSTILE_SECRET_KEY
          ? "Client and server verification keys are configured."
          : "Turnstile keys are incomplete.",
    }),
    Promise.resolve<ServiceCheck>({
      id: "auth",
      label: "Google admin auth",
      state: authConfig.configured ? "operational" : "not_configured",
      detail: authConfig.configured ? "OAuth and administrator allowlist are configured." : "OAuth setup is incomplete.",
    }),
    Promise.resolve<ServiceCheck>({
      id: "vercel",
      label: "Vercel telemetry",
      state: "operational",
      detail: "Web Analytics and sampled Speed Insights are installed.",
    }),
  ]);

  return {
    generatedAt: new Date().toISOString(),
    release: process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 12) ?? "local",
    environment: process.env.VERCEL_ENV ?? process.env.NODE_ENV ?? "unknown",
    submissions: { ...combined, available: submissionsAvailable },
    services,
  };
}

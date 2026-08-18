import { randomUUID } from "node:crypto";

import { logger } from "@/lib/observability/logger";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const requestId = randomUUID();
  logger.info("health.checked", { requestId });

  return Response.json(
    {
      status: "ok",
      service: "akhil-portfolio",
      timestamp: new Date().toISOString(),
      release: process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 12) ?? "local",
    },
    {
      headers: {
        "Cache-Control": "no-store, max-age=0",
        "X-Request-Id": requestId,
      },
    },
  );
}

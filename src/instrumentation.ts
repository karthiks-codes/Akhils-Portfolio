import type { Instrumentation } from "next";

import { errorName, logger } from "@/lib/observability/logger";

export function register() {
  logger.info("runtime.started", {
    runtime: process.env.NEXT_RUNTIME ?? "unknown",
    environment: process.env.VERCEL_ENV ?? process.env.NODE_ENV ?? "unknown",
    release: process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 12),
  });
}

export const onRequestError: Instrumentation.onRequestError = async (error, request, context) => {
  const digest =
    typeof error === "object" && error !== null && "digest" in error
      ? String(error.digest)
      : undefined;

  logger.error("request.unhandled_error", {
    errorName: errorName(error),
    digest,
    method: request.method,
    path: request.path.split("?")[0],
    route: context.routePath,
    routeType: context.routeType,
    router: context.routerKind,
  });
};

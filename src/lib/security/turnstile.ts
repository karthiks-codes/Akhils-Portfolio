import { z } from "zod";

import { logger } from "@/lib/observability/logger";

const turnstileResponseSchema = z.object({
  success: z.boolean(),
  action: z.string().optional(),
  hostname: z.string().optional(),
  "error-codes": z.array(z.string()).optional(),
});

export async function verifyTurnstile(
  token: string,
  secret: string,
  expectedAction: string,
  expectedHostnames: ReadonlySet<string>,
  remoteAddress?: string,
) {
  if (!token || token.length > 2048 || expectedHostnames.size === 0) return false;

  const body = new URLSearchParams({ secret, response: token });
  if (remoteAddress && remoteAddress !== "unknown") body.set("remoteip", remoteAddress);

  try {
    const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body,
      signal: AbortSignal.timeout(8_000),
    });
    if (!response.ok) {
      logger.warn("submission.turnstile_http_error", { status: response.status });
      return false;
    }
    const result = turnstileResponseSchema.parse(await response.json());
    const valid = Boolean(
      result.success &&
        result.action === expectedAction &&
        result.hostname &&
        expectedHostnames.has(result.hostname.toLowerCase()),
    );
    if (!valid) {
      logger.warn("submission.turnstile_rejected", {
        success: result.success,
        action: result.action,
        hostname: result.hostname,
        expectedAction,
        hostnameAllowed: Boolean(result.hostname && expectedHostnames.has(result.hostname.toLowerCase())),
        errorCodes: result["error-codes"]?.join(","),
      });
    }
    return valid;
  } catch (error) {
    logger.warn("submission.turnstile_unavailable", {
      errorType: error instanceof Error ? error.name : "UnknownError",
    });
    return false;
  }
}

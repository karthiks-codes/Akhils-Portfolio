import { z } from "zod";

const turnstileResponseSchema = z.object({
  success: z.boolean(),
  action: z.string().optional(),
  hostname: z.string().optional(),
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
    if (!response.ok) return false;
    const result = turnstileResponseSchema.parse(await response.json());
    return Boolean(
      result.success &&
        result.action === expectedAction &&
        result.hostname &&
        expectedHostnames.has(result.hostname.toLowerCase()),
    );
  } catch {
    return false;
  }
}

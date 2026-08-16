import { z } from "zod";

const turnstileResponseSchema = z.object({ success: z.boolean() });

export async function verifyTurnstile(token: string, secret: string, remoteAddress?: string) {
  const body = new URLSearchParams({ secret, response: token });
  if (remoteAddress && remoteAddress !== "unknown") body.set("remoteip", remoteAddress);

  try {
    const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body,
      signal: AbortSignal.timeout(8_000),
    });
    if (!response.ok) return false;
    return turnstileResponseSchema.parse(await response.json()).success;
  } catch {
    return false;
  }
}

import { afterEach, describe, expect, it, vi } from "vitest";

import { verifyTurnstile } from "@/lib/security/turnstile";

describe("verifyTurnstile", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("requires a successful response with the expected action and hostname", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ success: true, action: "contact", hostname: "WWW.AKHILKARTHIK.TECH" }), {
          status: 200,
        }),
      ),
    );

    await expect(
      verifyTurnstile("token", "secret", "contact", new Set(["www.akhilkarthik.tech"])),
    ).resolves.toBe(true);
  });

  it("rejects action and hostname mismatches", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ success: true, action: "contact", hostname: "localhost" }), { status: 200 }),
      ),
    );

    await expect(
      verifyTurnstile("token", "secret", "project-suggestion", new Set(["www.akhilkarthik.tech"])),
    ).resolves.toBe(false);
  });

  it("does not call Siteverify for an empty or oversized token", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    await expect(verifyTurnstile("", "secret", "contact", new Set(["localhost"]))).resolves.toBe(false);
    await expect(verifyTurnstile("x".repeat(2049), "secret", "contact", new Set(["localhost"]))).resolves.toBe(false);
    expect(fetchMock).not.toHaveBeenCalled();
  });
});

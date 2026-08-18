import { describe, expect, it, vi } from "vitest";

import { processSubmission, SubmissionError, type SubmissionAdapters } from "@/lib/submissions/pipeline";
import type { ContactInput } from "@/lib/validation/submissions";

const input: ContactInput = {
  name: "A Visitor",
  email: "visitor@example.com",
  subject: "Hello",
  message: "A useful and sufficiently detailed portfolio message.",
  website: "",
  turnstileToken: "verified",
};

function adapters(overrides: Partial<SubmissionAdapters> = {}): SubmissionAdapters {
  return {
    now: () => new Date("2026-08-16T10:00:00.000Z"),
    id: () => "submission-id",
    verifyCaptcha: vi.fn().mockResolvedValue(true),
    consumeLimit: vi.fn().mockReturnValue({ allowed: true, retryAfter: 0 }),
    reserveDuplicate: vi.fn().mockReturnValue(true),
    releaseDuplicate: vi.fn(),
    store: vi.fn().mockResolvedValue(undefined),
    updateStatus: vi.fn().mockResolvedValue(undefined),
    deliver: vi.fn().mockResolvedValue({
      notificationEmailId: "notification-email-id",
      acknowledgementEmailId: "acknowledgement-email-id",
    }),
    ...overrides,
  };
}

describe("submission pipeline", () => {
  it("stores, delivers and marks a valid submission as sent", async () => {
    const provider = adapters();
    await expect(
      processSubmission("contact", input, { remoteAddress: "127.0.0.1", abuseIdentifier: "hashed-ip" }, provider),
    ).resolves.toEqual({ id: "submission-id" });
    expect(provider.store).toHaveBeenCalledWith(expect.objectContaining({ deliveryStatus: "pending", abuseIdentifier: "hashed-ip" }));
    expect(provider.deliver).toHaveBeenCalledOnce();
    expect(provider.updateStatus).toHaveBeenLastCalledWith(
      expect.any(Object),
      "sent",
      expect.objectContaining({ notificationEmailId: "notification-email-id" }),
    );
  });

  it("releases duplicate reservation when captcha fails", async () => {
    const provider = adapters({ verifyCaptcha: vi.fn().mockResolvedValue(false) });
    await expect(
      processSubmission("contact", input, { remoteAddress: "127.0.0.1", abuseIdentifier: "hashed-ip" }, provider),
    ).rejects.toMatchObject({ code: "captcha", status: 400 });
    expect(provider.releaseDuplicate).toHaveBeenCalledOnce();
    expect(provider.deliver).not.toHaveBeenCalled();
  });

  it("returns a safe failure and records failed delivery", async () => {
    const provider = adapters({ deliver: vi.fn().mockRejectedValue(new Error("provider secret")) });
    let thrown: unknown;
    try {
      await processSubmission("contact", input, { remoteAddress: "127.0.0.1", abuseIdentifier: "hashed-ip" }, provider);
    } catch (error) {
      thrown = error;
    }
    expect(thrown).toBeInstanceOf(SubmissionError);
    expect((thrown as SubmissionError).message).not.toContain("provider secret");
    expect(provider.updateStatus).toHaveBeenLastCalledWith(expect.any(Object), "failed");
  });
});

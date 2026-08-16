import { describe, expect, it } from "vitest";

import { contactSchema, suggestionSchema } from "@/lib/validation/submissions";

const base = {
  name: "  Akhil   Karthik ",
  email: "HELLO@EXAMPLE.COM",
  website: "",
  turnstileToken: "verified-token",
};

describe("submission validation", () => {
  it("normalizes contact input and applies limits", () => {
    const parsed = contactSchema.parse({ ...base, subject: "  Project   idea ", message: "A sufficiently detailed message." });
    expect(parsed.name).toBe("Akhil Karthik");
    expect(parsed.email).toBe("hello@example.com");
    expect(parsed.subject).toBe("Project idea");
  });

  it("rejects honeypot and short messages", () => {
    expect(contactSchema.safeParse({ ...base, website: "bot", message: "short" }).success).toBe(false);
  });

  it("accepts suggestions only for canonical ongoing slugs", () => {
    expect(suggestionSchema.safeParse({ ...base, projectSlug: "tripshield", suggestion: "Please consider a bounded simulation mode." }).success).toBe(true);
    expect(suggestionSchema.safeParse({ ...base, projectSlug: "smartskin", suggestion: "Please add this feature to the project." }).success).toBe(false);
  });
});

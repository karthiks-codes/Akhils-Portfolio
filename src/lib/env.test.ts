import { afterEach, describe, expect, it, vi } from "vitest";

import { getAuthConfig } from "@/lib/env";

describe("getAuthConfig", () => {
  afterEach(() => vi.unstubAllEnvs());

  it("accepts a complete Google admin configuration independently of other services", () => {
    vi.stubEnv("AUTH_SECRET", "a".repeat(32));
    vi.stubEnv("AUTH_GOOGLE_ID", "google-client-id");
    vi.stubEnv("AUTH_GOOGLE_SECRET", "google-client-secret");
    vi.stubEnv("ADMIN_EMAILS", " Admin@Example.com ");
    vi.stubEnv("MONGODB_URI", "not-a-mongodb-uri");

    expect(getAuthConfig()).toMatchObject({
      configured: true,
      adminEmails: ["admin@example.com"],
    });
  });

  it("rejects an authentication secret shorter than 32 characters", () => {
    vi.stubEnv("AUTH_SECRET", "too-short");
    vi.stubEnv("AUTH_GOOGLE_ID", "google-client-id");
    vi.stubEnv("AUTH_GOOGLE_SECRET", "google-client-secret");
    vi.stubEnv("ADMIN_EMAILS", "admin@example.com");

    expect(getAuthConfig()).toMatchObject({ configured: false, adminEmails: [] });
  });
});

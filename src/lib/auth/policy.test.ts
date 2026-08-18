import { describe, expect, it } from "vitest";

import { isAdminEmail } from "@/lib/auth/policy";

describe("admin authorization policy", () => {
  const allowlist = ["akhilkarthikboddupalli@gmail.com"];

  it("normalizes an allowlisted Google account", () => {
    expect(isAdminEmail("  AkhilKarthikBoddupalli@gmail.com ", allowlist)).toBe(true);
  });

  it("rejects absent and unlisted accounts", () => {
    expect(isAdminEmail(undefined, allowlist)).toBe(false);
    expect(isAdminEmail("someone@example.com", allowlist)).toBe(false);
  });
});

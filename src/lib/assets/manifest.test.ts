import { afterEach, describe, expect, it } from "vitest";

import { localAssets, resolveAssetUrl } from "@/lib/assets/manifest";

const original = process.env.NEXT_PUBLIC_ASSET_BASE_URL;

afterEach(() => {
  process.env.NEXT_PUBLIC_ASSET_BASE_URL = original;
});

describe("asset resolver", () => {
  it("uses canonical local assets by default", () => {
    delete process.env.NEXT_PUBLIC_ASSET_BASE_URL;
    expect(resolveAssetUrl(localAssets.portrait)).toBe(localAssets.portrait);
  });

  it("preserves the assets key beneath a configured CDN base", () => {
    process.env.NEXT_PUBLIC_ASSET_BASE_URL = "https://cdn.example.com/";
    expect(resolveAssetUrl(localAssets.resume)).toBe(
      "https://cdn.example.com/assets/personal/resume/akhil-karthik-boddupalli-resume.pdf",
    );
  });
});

import { describe, expect, it } from "vitest";

import {
  BUSINESS_REVENUE_OPTIONS,
  COMPANY_SIZE_OPTIONS,
  normalizeProjectInquiryPayload,
  ROLE_OPTIONS,
} from "./validation";

const validPayload = {
  firstName: "Gustav",
  lastName: "Anderson",
  email: "HELLO@ARCITAI.COM",
  company: "Arc'IT",
  website: "https://arcitai.com",
  role: "Founder / owner",
  companySize: "1–5",
  businessRevenue: "DKK 50–100k / month",
  project: "Make the operating workflow easier to run.",
  source: "spoofed-source",
};

describe("project inquiry validation", () => {
  it("normalizes a valid payload and fixes Source server-side", () => {
    expect(normalizeProjectInquiryPayload(validPayload)).toEqual({
      ok: true,
      value: {
        ...validPayload,
        email: "hello@arcitai.com",
        source: "Website",
      },
    });
  });

  it.each([
    ["role", { role: "Founder" }, "Select a valid role"],
    ["company size", { companySize: "1-5" }, "Select a valid company size"],
    ["business revenue", { businessRevenue: "DKK 1–5m" }, "Select a valid business revenue range"],
  ] as const)("rejects an unlisted %s value", (_label, change, error) => {
    expect(normalizeProjectInquiryPayload({ ...validPayload, ...change })).toEqual({
      ok: false,
      error,
    });
  });

  it.each([
    ["javascript:alert(1)", "Website must use HTTP or HTTPS"],
    ["ftp://arcitai.com", "Website must use HTTP or HTTPS"],
  ] as const)("rejects a non-HTTP(S) website %s", (website, error) => {
    expect(normalizeProjectInquiryPayload({ ...validPayload, website })).toEqual({
      ok: false,
      error,
    });
  });

  it("rejects missing, non-text, and overlong fields", () => {
    expect(normalizeProjectInquiryPayload({ ...validPayload, project: "   " })).toEqual({
      ok: false,
      error: "Complete all required inquiry fields",
    });
    expect(normalizeProjectInquiryPayload({ ...validPayload, company: 42 })).toEqual({
      ok: false,
      error: "Inquiry fields must be text values",
    });
    expect(normalizeProjectInquiryPayload({ ...validPayload, project: "x".repeat(2_001) })).toEqual(
      { ok: false, error: "An inquiry field exceeds its limit" },
    );
  });

  it("keeps the allowlists explicit", () => {
    expect(ROLE_OPTIONS).toEqual([
      "Founder / owner",
      "Leadership",
      "Operations",
      "Product / technology",
      "Other",
    ]);
    expect(COMPANY_SIZE_OPTIONS).toEqual(["1–5", "6–15", "16–50", "51–150", "150+"]);
    expect(BUSINESS_REVENUE_OPTIONS).toEqual([
      "Pre-revenue",
      "Under DKK 50k / month",
      "DKK 50–100k / month",
      "DKK 100–500k / month",
      "DKK 500k–1m / month",
      "DKK 1m+ / month",
    ]);
  });
});

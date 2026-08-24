import type { ProjectInquiryPayload, ValidationResult } from "./types";

export const PROJECT_INQUIRY_SOURCE = "Website" as const;
export const MAX_BODY_BYTES = 16_384;

export const ROLE_OPTIONS = [
  "Founder / owner",
  "Leadership",
  "Operations",
  "Product / technology",
  "Other",
] as const;

export const COMPANY_SIZE_OPTIONS = ["1–5", "6–15", "16–50", "51–150", "150+"] as const;

export const BUSINESS_REVENUE_OPTIONS = [
  "Pre-revenue",
  "Under DKK 50k / month",
  "DKK 50–100k / month",
  "DKK 100–500k / month",
  "DKK 500k–1m / month",
  "DKK 1m+ / month",
] as const;

const FIELD_LIMITS = {
  firstName: 80,
  lastName: 80,
  email: 254,
  company: 120,
  website: 300,
  project: 2_000,
} as const;

const COMPLETE_FIELDS_ERROR = "Complete all required inquiry fields";
const FIELD_VALUES_ERROR = "Inquiry fields must be text values";
const FIELD_LENGTH_ERROR = "An inquiry field exceeds its limit";

export function normalizeProjectInquiryPayload(
  value: unknown,
): ValidationResult<ProjectInquiryPayload> {
  const record = toRecord(value);
  if (!record) {
    return { ok: false, error: COMPLETE_FIELDS_ERROR };
  }

  const firstName = readRequiredField(record, "firstName", FIELD_LIMITS.firstName);
  const lastName = readRequiredField(record, "lastName", FIELD_LIMITS.lastName);
  const email = readRequiredField(record, "email", FIELD_LIMITS.email);
  const company = readRequiredField(record, "company", FIELD_LIMITS.company);
  const role = readRequiredField(record, "role");
  const companySize = readRequiredField(record, "companySize");
  const businessRevenue = readRequiredField(record, "businessRevenue");
  const project = readRequiredField(record, "project", FIELD_LIMITS.project);
  const website = readOptionalField(record, "website", FIELD_LIMITS.website);

  if (!firstName.ok) return firstName;
  if (!lastName.ok) return lastName;
  if (!email.ok) return email;
  if (!company.ok) return company;
  if (!role.ok) return role;
  if (!companySize.ok) return companySize;
  if (!businessRevenue.ok) return businessRevenue;
  if (!project.ok) return project;
  if (!website.ok) return website;

  if (
    !firstName.value ||
    !lastName.value ||
    !email.value ||
    !company.value ||
    !role.value ||
    !companySize.value ||
    !businessRevenue.value ||
    !project.value
  ) {
    return { ok: false, error: COMPLETE_FIELDS_ERROR };
  }

  const normalizedEmail = email.value.toLowerCase();
  if (!isValidEmail(normalizedEmail)) {
    return { ok: false, error: "Enter a valid email address" };
  }

  if (website.value && !isHttpUrl(website.value)) {
    return { ok: false, error: "Website must use HTTP or HTTPS" };
  }

  if (!ROLE_OPTIONS.includes(role.value as (typeof ROLE_OPTIONS)[number])) {
    return { ok: false, error: "Select a valid role" };
  }

  if (!COMPANY_SIZE_OPTIONS.includes(companySize.value as (typeof COMPANY_SIZE_OPTIONS)[number])) {
    return { ok: false, error: "Select a valid company size" };
  }

  if (
    !BUSINESS_REVENUE_OPTIONS.includes(
      businessRevenue.value as (typeof BUSINESS_REVENUE_OPTIONS)[number],
    )
  ) {
    return { ok: false, error: "Select a valid business revenue range" };
  }

  return {
    ok: true,
    value: {
      firstName: firstName.value,
      lastName: lastName.value,
      email: normalizedEmail,
      company: company.value,
      website: website.value,
      role: role.value,
      companySize: companySize.value,
      businessRevenue: businessRevenue.value,
      project: project.value,
      source: PROJECT_INQUIRY_SOURCE,
    },
  };
}

function readRequiredField(
  record: Record<string, unknown>,
  key: string,
  limit?: number,
): ValidationResult<string> {
  const value = record[key];
  if (typeof value !== "string") {
    return { ok: false, error: FIELD_VALUES_ERROR };
  }

  const trimmed = value.trim();
  if (limit !== undefined && trimmed.length > limit) {
    return { ok: false, error: FIELD_LENGTH_ERROR };
  }

  return { ok: true, value: trimmed };
}

function readOptionalField(
  record: Record<string, unknown>,
  key: string,
  limit: number,
): ValidationResult<string> {
  if (!(key in record)) {
    return { ok: true, value: "" };
  }

  return readRequiredField(record, key, limit);
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function isHttpUrl(value: string) {
  try {
    const url = new URL(value);
    return (url.protocol === "http:" || url.protocol === "https:") && url.hostname.length > 0;
  } catch {
    return false;
  }
}

function toRecord(value: unknown): Record<string, unknown> | null {
  return typeof value === "object" && value !== null && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null;
}

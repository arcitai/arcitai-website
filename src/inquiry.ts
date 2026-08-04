export type ProjectInquiryPayload = {
  firstName: string;
  lastName: string;
  email: string;
  company: string;
  website: string;
  role: string;
  companySize: string;
  businessRevenue: string;
  project: string;
  source: "Website";
};

export type InquiryFailure =
  "configuration" | "network" | "protocol" | "server" | "timeout" | "validation";

export class InquirySubmissionError extends Error {
  readonly kind: InquiryFailure;

  constructor(kind: InquiryFailure) {
    super(kind);
    this.name = "InquirySubmissionError";
    this.kind = kind;
  }
}

type SubmitOptions = {
  endpoint: string;
  fetcher?: typeof fetch;
  signal?: AbortSignal;
};

export function inquiryPayloadFromForm(data: FormData): ProjectInquiryPayload {
  const read = (key: string) => {
    const value = data.get(key);
    return typeof value === "string" ? value.trim() : "";
  };

  return {
    firstName: read("firstName"),
    lastName: read("lastName"),
    email: read("email").toLowerCase(),
    company: read("company"),
    website: read("website"),
    role: read("role"),
    companySize: read("companySize"),
    businessRevenue: read("businessRevenue"),
    project: read("project"),
    source: "Website",
  };
}

export async function submitProjectInquiry(
  payload: ProjectInquiryPayload,
  { endpoint, fetcher = fetch, signal }: SubmitOptions,
) {
  if (!endpoint) throw new InquirySubmissionError("configuration");

  let response: Response;
  try {
    response = await fetcher(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal,
    });
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      throw new InquirySubmissionError("timeout");
    }
    throw new InquirySubmissionError("network");
  }

  const result: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    throw new InquirySubmissionError(response.status === 400 ? "validation" : "server");
  }

  if (!isAcknowledgement(result)) {
    throw new InquirySubmissionError("protocol");
  }
}

function isAcknowledgement(value: unknown): value is { ok: true } {
  return typeof value === "object" && value !== null && "ok" in value && value.ok === true;
}

import { describe, expect, it, vi } from "vitest";

import {
  InquirySubmissionError,
  inquiryPayloadFromForm,
  submitProjectInquiry,
  type ProjectInquiryPayload,
} from "./inquiry";

const payload: ProjectInquiryPayload = {
  firstName: "Gustav",
  lastName: "Anderson",
  email: "hello@arcitai.com",
  company: "Arc'IT",
  website: "https://arcitai.com",
  role: "Founder / owner",
  companySize: "1–5",
  project: "Make the operating workflow easier to run.",
  source: "Website",
};

describe("project inquiry client", () => {
  it("normalizes the exact Worker payload from form data", () => {
    const data = new FormData();
    Object.entries({
      firstName: " Gustav ",
      lastName: " Anderson ",
      email: " HELLO@ARCITAI.COM ",
      company: " Arc'IT ",
      website: " https://arcitai.com ",
      role: "Founder / owner",
      companySize: "1–5",
      project: " Make the operating workflow easier to run. ",
    }).forEach(([key, value]) => data.set(key, value));

    expect(inquiryPayloadFromForm(data)).toEqual(payload);
  });

  it("posts JSON and accepts only the Worker acknowledgement", async () => {
    const fetcher = vi.fn<typeof fetch>().mockResolvedValue(
      new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }),
    );

    await expect(
      submitProjectInquiry(payload, { endpoint: "https://example.com/inquiry", fetcher }),
    ).resolves.toBeUndefined();
    expect(fetcher).toHaveBeenCalledOnce();
    expect(fetcher).toHaveBeenCalledWith(
      "https://example.com/inquiry",
      expect.objectContaining({
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }),
    );
  });

  it.each([
    [400, "validation"],
    [429, "server"],
    [502, "server"],
  ] as const)("maps HTTP %s to a safe %s failure", async (status, kind) => {
    const fetcher = vi
      .fn<typeof fetch>()
      .mockResolvedValue(new Response(JSON.stringify({ error: "untrusted detail" }), { status }));

    await expect(
      submitProjectInquiry(payload, { endpoint: "https://example.com/inquiry", fetcher }),
    ).rejects.toMatchObject({ kind });
  });

  it("rejects a successful status without the acknowledgement contract", async () => {
    const fetcher = vi
      .fn<typeof fetch>()
      .mockResolvedValue(new Response("not-json", { status: 200 }));

    await expect(
      submitProjectInquiry(payload, { endpoint: "https://example.com/inquiry", fetcher }),
    ).rejects.toMatchObject({ kind: "protocol" });
  });

  it("maps network and timeout failures without exposing transport details", async () => {
    const networkFetcher = vi
      .fn<typeof fetch>()
      .mockRejectedValue(new Error("private network detail"));
    await expect(
      submitProjectInquiry(payload, {
        endpoint: "https://example.com/inquiry",
        fetcher: networkFetcher,
      }),
    ).rejects.toMatchObject({ kind: "network" });

    const timeoutFetcher = vi
      .fn<typeof fetch>()
      .mockRejectedValue(new DOMException("The operation was aborted", "AbortError"));
    await expect(
      submitProjectInquiry(payload, {
        endpoint: "https://example.com/inquiry",
        fetcher: timeoutFetcher,
      }),
    ).rejects.toEqual(new InquirySubmissionError("timeout"));
  });
});

import { describe, expect, it, vi } from "vitest";

import { buildProjectInquiryPage, createProjectInquiry } from "./notion";
import type { Env, ProjectInquiryPayload } from "../types";

const payload: ProjectInquiryPayload = {
  firstName: "Gustav",
  lastName: "Anderson",
  email: "hello@arcitai.com",
  company: "Arc'IT",
  website: "https://arcitai.com",
  role: "Founder / owner",
  companySize: "1–5",
  businessRevenue: "DKK 50–100k / month",
  project: "Make the operating workflow easier to run.",
  source: "Website",
};

const env: Env = {
  ALLOWED_ORIGINS: "https://arcitai.com",
  NOTION_PROJECT_INQUIRIES_DATA_SOURCE_ID: "6dddc32e-df5a-4da8-8cfd-1b3dd68861f4",
  NOTION_TOKEN: "test-token",
};

describe("Notion project inquiry adapter", () => {
  it("maps the contract to the Arc'IT data-source properties", () => {
    expect(buildProjectInquiryPage(payload, env.NOTION_PROJECT_INQUIRIES_DATA_SOURCE_ID)).toEqual({
      parent: {
        type: "data_source_id",
        data_source_id: "6dddc32e-df5a-4da8-8cfd-1b3dd68861f4",
      },
      properties: {
        Project: {
          title: [{ type: "text", text: { content: "Arc'IT — Gustav Anderson" } }],
        },
        Name: {
          rich_text: [{ type: "text", text: { content: "Gustav Anderson" } }],
        },
        Email: { email: "hello@arcitai.com" },
        Company: {
          rich_text: [{ type: "text", text: { content: "Arc'IT" } }],
        },
        Website: { url: "https://arcitai.com" },
        Role: { select: { name: "Founder / owner" } },
        "Company Size": { select: { name: "1–5" } },
        "Business Revenue": { select: { name: "DKK 50–100k / month" } },
        Context: {
          rich_text: [
            { type: "text", text: { content: "Make the operating workflow easier to run." } },
          ],
        },
        Source: { select: { name: "Website" } },
        Status: { select: { name: "New" } },
      },
    });
  });

  it("posts the mapped page and surfaces only a generic adapter failure", async () => {
    const fetcher = vi.fn<typeof fetch>().mockResolvedValue(new Response(null, { status: 200 }));

    await expect(createProjectInquiry(payload, env, fetcher)).resolves.toBeUndefined();
    expect(fetcher).toHaveBeenCalledWith(
      "https://api.notion.com/v1/pages",
      expect.objectContaining({
        method: "POST",
        headers: {
          Authorization: "Bearer test-token",
          "Content-Type": "application/json",
          "Notion-Version": "2025-09-03",
        },
        body: JSON.stringify(
          buildProjectInquiryPage(payload, env.NOTION_PROJECT_INQUIRIES_DATA_SOURCE_ID),
        ),
      }),
    );

    const failedFetcher = vi
      .fn<typeof fetch>()
      .mockResolvedValue(new Response(null, { status: 500 }));
    await expect(createProjectInquiry(payload, env, failedFetcher)).rejects.toThrow(
      "Notion inquiry write failed",
    );
  });
});

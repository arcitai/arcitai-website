import { describe, expect, it, vi } from "vitest";

import { handleRequest } from "./index";
import type { Env, ProjectInquiryPayload } from "./types";

const env: Env = {
  ALLOWED_ORIGINS:
    "https://arcitai.com,https://www.arcitai.com,http://127.0.0.1:4173,http://127.0.0.1:4174",
  NOTION_PROJECT_INQUIRIES_DATA_SOURCE_ID: "6dddc32e-df5a-4da8-8cfd-1b3dd68861f4",
  NOTION_TOKEN: "test-token",
};

const validPayload = {
  firstName: "Gustav",
  lastName: "Anderson",
  email: "hello@arcitai.com",
  company: "Arc'IT",
  website: "https://arcitai.com",
  role: "Founder / owner",
  companySize: "1–5",
  businessRevenue: "DKK 50–100k / month",
  project: "Make the operating workflow easier to run.",
  source: "spoofed-source",
};

const request = (body: unknown, origin = "https://arcitai.com") =>
  new Request("https://api.arcitai.com/project-inquiry", {
    method: "POST",
    headers: {
      Origin: origin,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

describe("project inquiry Worker route", () => {
  it("answers an allowed preflight without exposing a write path", async () => {
    const response = await handleRequest(
      new Request("https://api.arcitai.com/project-inquiry", {
        method: "OPTIONS",
        headers: {
          Origin: "https://www.arcitai.com",
          "Access-Control-Request-Method": "POST",
        },
      }),
      env,
    );

    expect(response.status).toBe(204);
    expect(response.headers.get("Access-Control-Allow-Origin")).toBe("https://www.arcitai.com");
    expect(response.headers.get("Access-Control-Allow-Methods")).toBe("POST, OPTIONS");
  });

  it("rejects a foreign browser origin before validation or Notion", async () => {
    const createProjectInquiry =
      vi.fn<(payload: ProjectInquiryPayload, env: Env) => Promise<void>>();
    const response = await handleRequest(request(validPayload, "https://gustavonline.com"), env, {
      createProjectInquiry,
    });

    expect(response.status).toBe(403);
    expect(await response.json()).toEqual({ error: "Origin not allowed" });
    expect(createProjectInquiry).not.toHaveBeenCalled();
    expect(response.headers.has("Access-Control-Allow-Origin")).toBe(false);
  });

  it("validates, fixes Source, and acknowledges a mocked Notion success", async () => {
    const createProjectInquiry = vi
      .fn<(payload: ProjectInquiryPayload, env: Env) => Promise<void>>()
      .mockResolvedValue(undefined);
    const response = await handleRequest(request(validPayload), env, { createProjectInquiry });

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ ok: true });
    expect(createProjectInquiry).toHaveBeenCalledWith({ ...validPayload, source: "Website" }, env);
  });

  it("returns a safe failure when the mocked Notion write fails", async () => {
    const createProjectInquiry = vi
      .fn<(payload: ProjectInquiryPayload, env: Env) => Promise<void>>()
      .mockRejectedValue(new Error("private Notion detail"));
    const response = await handleRequest(request(validPayload), env, { createProjectInquiry });

    expect(response.status).toBe(502);
    const body = await response.text();
    expect(JSON.parse(body)).toEqual({
      error: "The inquiry could not be saved. Please try again.",
    });
    expect(body).not.toContain("private Notion detail");
  });

  it("rejects malformed JSON before calling Notion", async () => {
    const createProjectInquiry =
      vi.fn<(payload: ProjectInquiryPayload, env: Env) => Promise<void>>();
    const response = await handleRequest(
      new Request("https://api.arcitai.com/project-inquiry", {
        method: "POST",
        headers: {
          Origin: "https://arcitai.com",
          "Content-Type": "application/json",
        },
        body: "{not-json",
      }),
      env,
      { createProjectInquiry },
    );

    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({ error: "Send valid JSON" });
    expect(createProjectInquiry).not.toHaveBeenCalled();
  });

  it("keeps the route surface narrow", async () => {
    const getResponse = await handleRequest(
      new Request("https://api.arcitai.com/posts", { method: "GET" }),
      env,
    );
    expect(getResponse.status).toBe(404);

    const getInquiry = await handleRequest(
      new Request("https://api.arcitai.com/project-inquiry", { method: "GET" }),
      env,
    );
    expect(getInquiry.status).toBe(405);
    expect(getInquiry.headers.get("Allow")).toBe("POST, OPTIONS");
  });
});

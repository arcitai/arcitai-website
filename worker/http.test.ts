import { describe, expect, it } from "vitest";

import { corsHeaders, isAllowedOrigin, readJsonBody } from "./http";
import { MAX_BODY_BYTES } from "./validation";

const env = {
  ALLOWED_ORIGINS:
    "https://arcitai.com,https://www.arcitai.com,http://127.0.0.1:4173,http://127.0.0.1:4174",
};

describe("Worker CORS and body boundaries", () => {
  it("allows only the configured Arc'IT and documented local origins", () => {
    expect(isAllowedOrigin("https://arcitai.com", env)).toBe(true);
    expect(isAllowedOrigin("https://www.arcitai.com", env)).toBe(true);
    expect(isAllowedOrigin("http://127.0.0.1:4173", env)).toBe(true);
    expect(isAllowedOrigin("https://gustavonline.com", env)).toBe(false);
    expect(isAllowedOrigin("https://arcitai.pages.dev", env)).toBe(false);
    expect(isAllowedOrigin(null, env)).toBe(false);

    const headers = corsHeaders(
      new Request("https://api.arcitai.com/project-inquiry", {
        headers: { Origin: "https://arcitai.com" },
      }),
      env,
    );
    expect(headers.get("Access-Control-Allow-Origin")).toBe("https://arcitai.com");
    expect(headers.get("Access-Control-Allow-Methods")).toBe("POST, OPTIONS");
    expect(headers.get("Vary")).toBe("Origin");

    const foreignHeaders = corsHeaders(
      new Request("https://api.arcitai.com/project-inquiry", {
        headers: { Origin: "https://gustavonline.com" },
      }),
      env,
    );
    expect(foreignHeaders.has("Access-Control-Allow-Origin")).toBe(false);
  });

  it("parses JSON and rejects bodies above the server limit", async () => {
    const valid = await readJsonBody(
      new Request("https://api.arcitai.com/project-inquiry", {
        method: "POST",
        body: JSON.stringify({ project: "hello" }),
      }),
    );
    expect(valid).toEqual({ ok: true, value: { project: "hello" } });

    const tooLarge = await readJsonBody(
      new Request("https://api.arcitai.com/project-inquiry", {
        method: "POST",
        headers: { "Content-Length": String(MAX_BODY_BYTES + 1) },
        body: "{}",
      }),
    );
    expect(tooLarge).toEqual({ ok: false, error: "too_large" });
  });
});

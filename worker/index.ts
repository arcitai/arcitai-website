/// <reference types="@cloudflare/workers-types" />

import { createProjectInquiry } from "./adapters/notion";
import { corsHeaders, isAllowedOrigin, isJsonContentType, json, readJsonBody } from "./http";
import { normalizeProjectInquiryPayload } from "./validation";
import type { Env, ProjectInquiryPayload } from "./types";

const PROJECT_INQUIRY_PATH = "/project-inquiry";

type Dependencies = {
  createProjectInquiry: (payload: ProjectInquiryPayload, env: Env) => Promise<void>;
};

const productionDependencies: Dependencies = { createProjectInquiry };

export default {
  fetch(request, env) {
    return handleRequest(request, env, productionDependencies);
  },
} satisfies ExportedHandler<Env>;

export async function handleRequest(
  request: Request,
  env: Env,
  dependencies: Dependencies = productionDependencies,
): Promise<Response> {
  const origin = request.headers.get("Origin");
  if (origin && !isAllowedOrigin(origin, env)) {
    return json({ error: "Origin not allowed" }, 403, request, env);
  }

  const url = new URL(request.url);
  if (url.pathname !== PROJECT_INQUIRY_PATH) {
    return json({ error: "Not found" }, 404, request, env);
  }

  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders(request, env) });
  }

  if (request.method !== "POST") {
    return json({ error: "Method not allowed" }, 405, request, env, { Allow: "POST, OPTIONS" });
  }

  if (!isJsonContentType(request)) {
    return json({ error: "Content-Type must be application/json" }, 415, request, env);
  }

  const body = await readJsonBody(request);
  if (!body.ok) {
    return json(
      {
        error: body.error === "too_large" ? "Inquiry request is too large" : "Send valid JSON",
      },
      400,
      request,
      env,
    );
  }

  const result = normalizeProjectInquiryPayload(body.value);
  if (!result.ok) {
    return json({ error: result.error }, 400, request, env);
  }

  try {
    await dependencies.createProjectInquiry(result.value, env);
  } catch {
    return json({ error: "The inquiry could not be saved. Please try again." }, 502, request, env);
  }

  return json({ ok: true }, 200, request, env);
}

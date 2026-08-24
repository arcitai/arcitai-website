import type { Env } from "./types";
import { MAX_BODY_BYTES } from "./validation";

const JSON_CONTENT_TYPE = "application/json";

export type JsonBodyResult =
  { ok: true; value: unknown } | { ok: false; error: "invalid_json" | "too_large" };

export function isAllowedOrigin(origin: string | null, env: Pick<Env, "ALLOWED_ORIGINS">) {
  return Boolean(origin && parseAllowedOrigins(env).includes(origin));
}

export function corsHeaders(request: Request, env: Pick<Env, "ALLOWED_ORIGINS">) {
  const headers = new Headers({
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
    Vary: "Origin",
  });
  const origin = request.headers.get("Origin");

  if (origin && isAllowedOrigin(origin, env)) {
    headers.set("Access-Control-Allow-Origin", origin);
  }

  return headers;
}

export function json(
  body: Record<string, boolean | string>,
  status: number,
  request: Request,
  env: Pick<Env, "ALLOWED_ORIGINS">,
  extraHeaders?: HeadersInit,
) {
  const headers = corsHeaders(request, env);
  headers.set("Content-Type", "application/json; charset=utf-8");
  headers.set("Cache-Control", "no-store");

  if (extraHeaders) {
    new Headers(extraHeaders).forEach((value, key) => headers.set(key, value));
  }

  return new Response(JSON.stringify(body), { status, headers });
}

export async function readJsonBody(request: Request): Promise<JsonBodyResult> {
  const contentLength = request.headers.get("Content-Length");
  if (contentLength !== null) {
    const declaredLength = Number(contentLength);
    if (!Number.isFinite(declaredLength) || declaredLength < 0) {
      return { ok: false, error: "invalid_json" };
    }
    if (declaredLength > MAX_BODY_BYTES) {
      return { ok: false, error: "too_large" };
    }
  }

  if (!request.body) {
    return { ok: false, error: "invalid_json" };
  }

  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;

  try {
    while (true) {
      const result = await reader.read();
      if (result.done) break;

      size += result.value.byteLength;
      if (size > MAX_BODY_BYTES) {
        await reader.cancel();
        return { ok: false, error: "too_large" };
      }
      chunks.push(result.value);
    }
  } catch {
    return { ok: false, error: "invalid_json" };
  }

  const bytes = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }

  try {
    return { ok: true, value: JSON.parse(new TextDecoder().decode(bytes)) };
  } catch {
    return { ok: false, error: "invalid_json" };
  }
}

function parseAllowedOrigins(env: Pick<Env, "ALLOWED_ORIGINS">) {
  return env.ALLOWED_ORIGINS.split(",")
    .map((origin) => origin.trim())
    .filter((origin) => origin.length > 0 && origin !== "*");
}

export function isJsonContentType(request: Request) {
  const contentType = request.headers.get("Content-Type");
  return contentType?.split(";", 1)[0].trim().toLowerCase() === JSON_CONTENT_TYPE;
}

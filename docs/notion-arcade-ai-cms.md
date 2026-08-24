# Arc'IT Project Inquiry contract

Contract revision 1 for the Arc'IT-owned `arcitai-api` Worker. The Worker is
the authoritative validation and Notion write boundary; the browser sends no
secret and does not write to Notion.

## Ownership and endpoints

The intended custom-domain endpoint is:

```text
POST https://api.arcitai.com/project-inquiry
```

Wrangler also keeps a `workers.dev` deployment path for recovery. Its exact
account hostname is established by the first authorized deployment and must be
recorded in the release evidence; it is not the primary frontend endpoint.

The current shared
`https://gustavonline-api.gustavonline.workers.dev/project-inquiry` remains
live during Build and is not called with a valid inquiry. Gustav Online remains
the owner of newsletter/posts, and `onlinesourdough-resources` remains the
owner of Resources. Testimonials are an Arc'IT-owned future data concern with
no runtime endpoint while unused.

Worker linkage identity: `arcitai-inquiry-boundary-2026-08-24`.

## Request

```http
POST /project-inquiry
Content-Type: application/json
Origin: https://arcitai.com
```

The browser payload is:

| Field             | Required                | Server rule                                     |
| ----------------- | ----------------------- | ----------------------------------------------- |
| `firstName`       | yes                     | trimmed string, maximum 80 characters           |
| `lastName`        | yes                     | trimmed string, maximum 80 characters           |
| `email`           | yes                     | trimmed, lowercased, valid email, max 254       |
| `company`         | yes                     | trimmed string, maximum 120 characters          |
| `website`         | no                      | empty or an HTTP(S) URL, maximum 300 characters |
| `role`            | yes                     | exact approved value                            |
| `companySize`     | yes                     | exact approved value                            |
| `businessRevenue` | yes                     | exact approved value                            |
| `project`         | yes                     | trimmed string, maximum 2,000 characters        |
| `source`          | ignored from the client | always written server-side as `Website`         |

The total request body is limited to 16,384 bytes. Missing, non-string,
overlong, malformed, or disallowed values are rejected before a Notion call.

Approved roles:

- `Founder / owner`
- `Leadership`
- `Operations`
- `Product / technology`
- `Other`

Approved company sizes:

- `1–5`
- `6–15`
- `16–50`
- `51–150`
- `150+`

Approved business-revenue values:

- `Pre-revenue`
- `Under DKK 50k / month`
- `DKK 50–100k / month`
- `DKK 100–500k / month`
- `DKK 500k–1m / month`
- `DKK 1m+ / month`

## Response

- `200 { "ok": true }`: the Notion write was acknowledged; the browser may
  reset the form.
- `400 { "error": "..." }`: body, required, bounded, format, or allowlist
  validation failed.
- `403 { "error": "Origin not allowed" }`: a request supplied a foreign
  browser origin.
- `405 { "error": "Method not allowed" }`: the route method is not supported.
- `415 { "error": "Content-Type must be application/json" }`: the request is
  not JSON.
- `502 { "error": "The inquiry could not be saved. Please try again." }`: the
  Notion write failed; provider detail is never returned.

The browser accepts success only when the response is a 2xx JSON object with
`{ "ok": true }`. Timeout, network, invalid JSON, another non-2xx status, or a
2xx response without that acknowledgement remains a failure. Form values stay
present on failure and reset only after acknowledgement.

## Notion mapping

The Worker uses the current Arc'IT Project Inquiries data source:

```text
6dddc32e-df5a-4da8-8cfd-1b3dd68861f4
```

It creates a page with this mapping:

| Notion property    | Value                                                          |
| ------------------ | -------------------------------------------------------------- |
| `Project`          | `{company} — {firstName} {lastName}`, capped at 120 characters |
| `Name`             | `{firstName} {lastName}`                                       |
| `Email`            | `email`                                                        |
| `Company`          | `company`                                                      |
| `Website`          | `website` or null                                              |
| `Role`             | `role`                                                         |
| `Company Size`     | `companySize`                                                  |
| `Business Revenue` | `businessRevenue`                                              |
| `Context`          | `project`, capped at 2,000 characters                          |
| `Source`           | fixed `Website`                                                |
| `Status`           | fixed `New`                                                    |

The only Worker secret is a dedicated Cloudflare secret named
`NOTION_TOKEN`. It must be set on `arcitai-api` with the interactive
`npm run worker:secret:put` command. It is never committed, printed, sent to
Pages, or exposed to the browser.

## CORS and abuse boundary

Production CORS allows exactly:

- `https://arcitai.com`
- `https://www.arcitai.com`

Local development additionally allows only `http://127.0.0.1:4173` and
`http://127.0.0.1:4174`. The Pages `pages.dev` origin, Gustav Online origins,
and wildcard CORS are excluded. CORS is browser isolation, not authentication;
direct clients can still attempt requests. Residual abuse and rate-limit risk
is documented and intentionally has no speculative infrastructure until real
traffic demonstrates the need.

The Worker code does not log inquiry content. Tests inject a fake Notion adapter
or fetcher and never create a real row. Build proof is therefore limited to
local validation, routing/CORS, mapping, safe success/failure mocks, and a
Wrangler dry-run. Live custom-domain, secret, DNS, and browser proof require an
authorized deployment and remain unavailable during this Build.

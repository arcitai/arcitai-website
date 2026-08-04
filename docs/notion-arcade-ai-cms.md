# Project inquiry contract

The landing page consumes the existing Gustav Online Cloudflare Worker. This
repository owns the browser caller and UI states; the Worker owns authoritative
validation, the Notion credential, and record creation.

## Endpoint

```text
POST https://gustavonline-api.gustavonline.workers.dev/project-inquiry
Content-Type: application/json
Origin: https://arcitai.com
```

The server contract was inspected at Gustav Online commit
[`05a81997c8b34eb4c97b181626d93de8be7b15ce`](https://github.com/gustavonline/gustavonline/tree/05a81997c8b34eb4c97b181626d93de8be7b15ce)
and checked against the live Worker on 2026-08-03.

## Request

| Field             | Required                     | Browser source                     |
| ----------------- | ---------------------------- | ---------------------------------- |
| `firstName`       | yes                          | text input                         |
| `lastName`        | yes                          | text input                         |
| `email`           | yes, valid email             | email input                        |
| `company`         | yes                          | text input                         |
| `website`         | no, HTTP(S) URL when present | URL input                          |
| `role`            | yes                          | approved select                    |
| `companySize`     | yes                          | approved select                    |
| `businessRevenue` | yes, approved value          | radio group                        |
| `project`         | yes                          | textarea, maximum 2,000 characters |
| `source`          | yes                          | fixed browser value `Website`      |

Approved business-revenue values are:

- `Pre-revenue`
- `Under DKK 50k / month`
- `DKK 50–100k / month`
- `DKK 100–500k / month`
- `DKK 500k–1m / month`
- `DKK 1m+ / month`

## Response

- `200 { "ok": true }`: record was acknowledged; the browser may reset.
- `400 { "error": "..." }`: required or allowed input failed validation.
- `502 { "error": "..." }`: the Notion write failed.
- timeout, network failure, non-JSON, another non-2xx status, or a 2xx response
  without `{ "ok": true }`: unconfirmed failure.

The browser maps these to its own safe messages and never renders arbitrary
server detail. It keeps input on failure, disables duplicate submission only
while pending, and never opens a mail client automatically.

## CORS

The live preflight for `Origin: https://arcitai.com` returns:

```text
Access-Control-Allow-Origin: https://arcitai.com
Access-Control-Allow-Methods: GET,POST,OPTIONS
Access-Control-Allow-Headers: Content-Type
Vary: Origin
```

The Worker configuration also lists `https://www.arcitai.com` and local preview
origins `http://127.0.0.1:4173` and `:4174`. The Cloudflare Pages `pages.dev`
origin is not listed, so live pages.dev verification uses mocked form requests
and an intentionally invalid preflight; production form verification waits for
the custom domain or a separately authorized Worker CORS change.

## Data authority

Notion data source `a156e7e9-8a3a-47bb-93ef-734bfa24361d` owns durable inquiry
records. The Worker sets title, name, email, company, optional website, role,
company size, revenue, context, Source=`Website`, and Status=`New`.

The browser does not persist or log inquiry content. Release tests use mocked
success/failure plus an intentionally incomplete live payload. Do not create a
real inquiry record without separate authorization.

## Known boundary risk

The current server checks required fields, email, HTTP(S) website, and the
revenue allowlist. Role and company-size allowlists, abuse controls, and request
size limits remain responsibilities of the external Worker owner. The landing
page constrains ordinary input but cannot turn client validation into server
trust.

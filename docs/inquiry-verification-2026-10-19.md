# Project inquiry verification — 19 October 2026

The owner requested a check of the live inquiry and newsletter integrations.
Website changes remain local until the corrected preview has been reviewed.
The separately authorized Notion connection and Worker secret repair are live.

## Verified result

- The live newsletter form successfully upserted the existing owner test
  subscriber into the shared Kit audience with `source = arcitai`.
- After the connection repair below, the live `/project/` form displayed
  **Inquiry received. I’ll reply at the email you provided.** and reset its
  fields. Exactly one matching test record was read back from Notion, including
  the expected name, email, company, role, company size, context, `Source =
Website`, and initial `Status = New`. Optional website and revenue stayed
  empty. The synthetic test was then marked **Archived** and read back again.
  Its private record reference remains in the owner’s verification evidence.

## Initial failure and diagnosis

- The live `/project/` form failed twice with explicitly labelled synthetic
  owner test data. The browser received HTTP 502 from
  `https://api.arcitai.com/project-inquiry` with the safe error
  `The inquiry could not be saved. Please try again.` Form values were retained.
- The Notion Project Inquiries data source was empty before the test and after
  both failed attempts, and immediately before the successful retry.

- The pre-repair Worker version was `eb2addf7-6f5b-4362-ab7c-94ea651f6230`, serving
  100% of traffic since 25 September 2026. Its public bindings point to the
  expected data source, `6dddc32e-df5a-4da8-8cfd-1b3dd68861f4`, and the correct
  production origins. `NOTION_TOKEN` exists as a secret binding; its value was
  not retrieved. Its value was replaced only after the owner's authorization.
- The current source accepts omitted revenue, so there is no evidence that the
  simplified form needs its removed revenue field restored.
- The current Notion schema matches the adapter's property names and types.
- The database's Actions menu reported **Connections: None**. The connection
  picker offers the owner's existing internal integration **onlinesourdough**.
  Its permission details show read access only, with no insert or update
  capability. Attaching it as-is would therefore not enable inquiry creation.
  The picker was cancelled without granting access or changing that shared
  integration's permissions.
  Missing database access was a plausible cause. The identity and validity of
  the old deployed secret were not established, so the earlier failure is not
  attributed to an expired or specific integration token without evidence.

## Completed repair

- The owner explicitly accepted Notion's Developer Terms and authorized
  completing **Arc’IT Project Inquiries** on 19 October 2026.
- Created that separate API-token connection with **only Insert content** enabled.
  Read content, Update content, comment capabilities, user information and
  agent access are disabled. The content access list contains only **Project
  Inquiries**, under Business home. The existing read-only onlinesourdough
  integration was not widened or changed.
- Set the token as the existing `NOTION_TOKEN` secret on **arcitai-api** in the
  gustavonline Cloudflare account using the pinned Wrangler. The credential was
  transferred through a restricted temporary file (directory 0700, file 0600),
  never printed or committed, and the file and temporary directory were
  removed after upload. The clipboard was cleared.
- Wrangler confirmed successful secret upload. Deployment readback shows
  **Secret Change**, version `76434ec7-1a98-426d-80b1-fed8fe98fa90`, serving
  **100%**. No Worker code, static website, DNS, or other binding was deployed.
- The single successful live test proves the create-only permission is enough
  for the current adapter. Readback and test archiving used the owner's
  separate Notion connector; the website token did not receive read/update
  permissions for verification.

## Evidence and follow-up

The local task's `outputs/` contains the live form acknowledgement and the
Notion connection's scoped access/capability screenshots. The test reference is
`website-check-20261019` and is clearly identified as synthetic owner data.
The inquiry integration is complete; website copy/layout publication remains
a separate preview approval. No test or customer message was emailed.

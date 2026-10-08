# Defense Factory operating contract

Implementation specification; no control is enforced by this document alone.

## Flow and independence

`Scoped review → Candidate finding → Validated finding → Authorised fix → Verification → Human closure`

Side states: `Rejected`, `Duplicate`, `Still vulnerable`, `Inconclusive`, `Blocked`, `Unknown/stale`, `Accepted risk`. Accepted risk retains the decision-maker, exact scope and rationale; it is never relabelled “fixed”. A no-finding scan is a scoped observation, not proof of absence.

Software Factory owns the delivery work record and active code writer. Defense Factory owns findings, their evidence and verification. Both reference the same customer, repository, work ID and head SHA. During a fix, transfer write ownership explicitly; never let two agents patch the same checkout. Release authority is separate from both engines.

## Review has two surfaces

**Code and dependencies:** the selected diff or repository scope, relevant failures, dependency/supply-chain checks and focused regression evidence.

**Agent operation:** data sources, permissions, credentials, tools, egress, handling of untrusted content, approval boundaries, model/tool changes, records, stop and recovery. Some properties require configuration inspection and authorised isolated runtime tests; they cannot be proved by code scanning alone.

Choose checks from actual risk and system responsibility. Do not test a third-party service simply because an agent can reach it. Personal agents can also expose private data; “one user” is not a security exemption.

## Activation requirements

- Written target/resource authorisation, accepted invariants and bounded active-test scope. An operator must supply an isolated representative environment before dynamic reproduction.
- Separate read-only review identity and bounded remediation identity. Neither has production deploy, policy-write or release-approval privileges.
- An approved provider/harness for the exact customer use. Daybreak access alone does not establish third-party authorisation. Use the supported authorised alternative or stop the affected job.
- Protected finding storage, repository/tenant authorisation, artifact redaction and explicit retention/deletion ownership. The public Build view must not leak titles or exploit details from private findings.
- Immutable job scope and artifact references; a bounded job/attempt ID, budget and stop process. A model response cannot set authoritative finding/approval status without validation.

## Minimum finding record

`finding_id`, customer/system/repository, source work ID, scanned SHA/scope, claimed impact, observed evidence, status, authorised action, patch SHA, verification result/evidence, residual gap, owner and latest sync. Store sensitive reproductions privately and link them; do not embed them into reusable examples or public issues.

A source adapter must preserve fixed/still-vulnerable/inconclusive distinctions. Coverage and tool failures remain visible. One unavailable scanner cannot be silently turned into “all checks passed”.

## Required acceptance cases

| Case                              | Required observation                                                               |
| --------------------------------- | ---------------------------------------------------------------------------------- |
| Scoped baseline review            | Tool/result records identify exact bytes, coverage and limitations                 |
| False positive or duplicate       | Finding is rejected/linked with evidence; no unnecessary patch                     |
| Safe synthetic regression         | Original check fails before fix and passes after; legitimate behaviour still works |
| Unsafe reproduction               | No active probe; explicit blocked/inconclusive result with available evidence      |
| Missing data or scanner failure   | No clean verdict or automatic closure                                              |
| Prompt injection in source/report | Review data cannot change policy, grant tool rights or exfiltrate secrets          |
| Stale scan or patch SHA           | Affected verdict invalidates when the candidate changes                            |
| Writer attempts release           | Platform denies merge/deploy irrespective of prompt                                |
| Cancellation                      | All related work stops or is visibly unresolved; no silent duplicate fix job       |
| Wrong tenant/public view          | Sensitive records and artifacts are denied server-side                             |

These are requirements for installation proof, not tests already run by this draft.

## Maintenance and recovery

Retain relevant regression evidence for later prompt, model, dependency, policy and tool changes. Replay affected cases before replacing the approved configuration. The operator reviews open/inconclusive findings and overdue ownership; no unsupported promise that every vulnerability is discovered.

If the security engine/provider is unavailable, pause dependent releases where the configured gate is required. An authorised human can make an explicit residual-risk decision under the existing policy; an agent cannot self-waive the gate. Restore the last reviewed configuration or proceed under a separately accepted method, preserving the failed attempt and proof gap.

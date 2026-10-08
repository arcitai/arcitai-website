# Software Factory operating contract

Status: implementation specification. Controls below are required for activation; prose alone does not enforce them.

## Flow and source of truth

`Intake → Ready → Implementing → Reviewing → Awaiting approval → Released`

Side states: `Needs input`, `Blocked`, `Failed`, `Cancelled`, `Unknown/stale`. A merged PR is recorded as merged; “Released” additionally requires evidence of the agreed deployment/result. The dashboard must not combine the two.

GitHub owns issues, code and PR facts. The selected engine owns its runs. A small installation-owned work record links `customer_id`, `work_id`, repository, base/head SHA, attempt/run ID, state, reviewer, latest heartbeat/sync, artifacts and actual/estimated/unknown cost. Immutable events and a unique work/attempt key prevent duplicate webhook delivery from starting another writer. These identifiers form a proposed adapter contract, not a shipped API.

## Customer installation

1. Select one product and supported repositories. Name the business outcome, test commands and human review/release owners.
2. Choose an engine and data boundary. Record plan, retention, model permission, egress and budget. For an initial watched pilot use concurrency one; higher concurrency requires workspace isolation and measured review capacity.
3. Use a repository-scoped identity. Read-only intake cannot push. A writer can create only the agreed branches/PRs. Protected branches, release credentials and policy configuration are outside its authority.
4. Provide an isolated workspace with a pinned base revision and a reproducible test environment. A worktree alone is not a security sandbox; no production secrets or broad home-directory mounts.
5. Configure a bounded duration, spend ceiling, retry ceiling and operator stop. A stopped dispatch loop is insufficient: verify child processes/runs also stopped, and revoke scoped credentials if cancellation is uncertain.
6. Route requested Defense checks on the exact candidate revision. The Software agent cannot approve its own patch or rewrite security policy to get a pass.
7. Connect the read-only overview. Authorise each response by customer and repository. No token in frontend code; no publicly embedded logs or findings.

## Engine choices

- **Warp:** map intake and stages to a versioned factory definition and native run IDs; use the built-in orchestration before adding a second scheduler. Software and Defense can be separate specialists in one product factory. Changes to factory definitions are reviewed.
- **Cursor:** use authorised Cloud Agents/API and its run/artifact records; preserve repository/environment choice and spend controls. Self-hosted workers still contact Cursor.
- **Direct CLI/CI:** the installation owns dispatch, workspace isolation, run limits, logs and recovery. Start with explicit dispatch and one work item. Build a queue only once actual unattended ownership is accepted. Do not run a perpetual loop because a sample script allows it.

## Domain acceptance before a live pilot

| Case                         | Required observation                                                                               |
| ---------------------------- | -------------------------------------------------------------------------------------------------- |
| One approved small change    | Candidate PR/branch matches acceptance; configured checks run; exact head SHA and evidence visible |
| Prompt injection in an issue | Text asking for secrets/policy changes cannot grant access or dispatch broader work                |
| Duplicate or delayed event   | Same event/work key creates no second writer and does not regress state                            |
| Head changes after review    | Previous approval becomes stale; current SHA needs affected tests/review                           |
| Runner loses contact         | UI says unknown/stale, never “still working” or “done” without evidence                            |
| Stop and retry               | Children stop; previous attempt is reconciled; retry uses clean workspace and a new linked attempt |
| Forbidden merge/deploy       | Platform denies writer even if its prompt attempts the action                                      |
| Wrong-customer viewer        | Server denies records and artifacts, not merely hides UI                                           |
| Budget or repeated failure   | Work stops within the agreed limit and retains an actionable reason                                |

No live case has been executed in this draft. A local contract rehearsal is not proof of these platform properties.

## Maintenance and exit

Arc’IT owns the agreed engine configuration, failed-run triage, cost review and tested upgrades. Customer owns its business approvals and data permissions. Record actual support hours/response terms; no implicit 24/7 duty.

Before changing model, prompt, adapter or environment, replay representative successful and failed work. Retain the old config revision and a rollback path. If the vendor breaks, stop new dispatch, reconcile in-flight work, export available evidence and move to a watched native CLI/CI run only within existing authority. Portability is a tested migration task, not a claim of interchangeable engines.

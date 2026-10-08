# AI Software Factory

Local source candidate `0.1.0`. Operator: Arc’IT AI for an explicitly authorised customer/product. Purpose: turn approved, repeatable development work into reviewable changes without making the customer coordinate every agent step.

## Entry and result

Entry: [software-factory](.agents/skills/software-factory/SKILL.md). Operating contract: [HANDBOOK.md](HANDBOOK.md).

Input: an authorised task, exact repository/revision, business acceptance criteria, supported execution environment, reviewer and run limits. Output: a focused branch/PR candidate, test and visual evidence where relevant, current status, measured/unknown cost, and the next human decision. A draft PR is not delivered production software.

## Included responsibilities

- Intake and readiness for one product; a single active writer per work item.
- Route implementation to an approved engine such as Warp, Cursor or direct CLI/CI.
- Enforce configured budget, environment and repository boundaries outside the prompt.
- Keep the work record and evidence linked through retries, review and recovery.
- Request Defense review for the configured risk/scope; retain its separate verdict.
- Populate a read-only Build overview from source records.

The reusable source is separate from each customer's configuration and working state. Customer-specific repo permissions, secrets, runs and retention do not belong in a distributed plugin. Installation is a service with a named operator and ongoing responsibility.

## Present capability

The domain method and handbook are drafted. The separate dashboard demonstrates the intended interface with synthetic records. No GitHub App, runner, queue, provider adapter, live telemetry or release enforcement is installed. The package cannot yet run unattended or be sold as proven operational software.

Adopted guidance: [System Template](https://github.com/onlinesourdough/Agentic-System-Template/tree/15e1fd9081cf11e7fe26fcc9b508976f3b0c75e2), historical revision `15e1fd9081cf11e7fe26fcc9b508976f3b0c75e2`. Locally authored instructions; no template runtime or update coupling. Deployment acceptance is defined in the handbook.

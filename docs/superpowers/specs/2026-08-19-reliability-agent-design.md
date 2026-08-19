# KhadakX Reliability Agent Design

## Goal
Create a permanent AI-powered reliability subsystem that captures CI/E2E/runtime failures, diagnoses root causes, proposes or applies minimal safe repairs, verifies them through progressively stronger tests, and protects end users through containment and rollback rather than exposing technical failures.

## Architecture
GitHub Actions remains the execution and evidence layer. A dedicated Reliability Agent consumes workflow/job/test evidence and structured diagnostics, classifies failures, correlates them with repository history and known failure signatures, and creates isolated repair changes. Repairs must pass targeted tests, affected suites, E2E, and full CI before being considered safe; high-risk production/business/security changes require human approval. Production-facing automation must support containment and rollback rather than allowing the agent to weaken safety controls.

## Current repository context
- Monorepo uses pnpm and declares `packageManager: pnpm@8.0.0` in the root package manifest.
- API is a NestJS application under `apps/api`.
- Existing CI and a dedicated Runtime E2E workflow exist under `.github/workflows/`.
- Runtime E2E currently validates real local HTTP delivery, HMAC verification, business identity continuity, and Blueprint version continuity for the AdForge integration.

## Core responsibilities

### 1. Evidence capture
Capture workflow run ID, repository, ref, commit SHA, workflow, job, step, command, exit code, timestamps, relevant environment versions, test names, stack traces, and sanitized artifacts. Never persist or print secrets.

### 2. Failure classification
Classify failures into CI orchestration, dependency/toolchain, build/typecheck, unit/integration/E2E test, runtime/infrastructure, database, external integration, security, performance, or unknown.

### 3. Failure knowledge base
Persist normalized failure signatures with root cause, affected component/file, successful fix, verification evidence, and originating PR/commit. Exact or high-confidence recurring failures should be diagnosed from this history before broad repository searching.

### 4. Safe diagnosis and repair
The agent may inspect repository code, workflow definitions, recent commits, previous successful fixes, and test evidence. It must prefer the smallest possible change and must never rewrite unrelated working code.

### 5. Verification ladder
Every proposed repair follows: targeted reproduction/test -> affected suite -> relevant E2E -> full CI. A repair is not considered successful until the required verification level passes.

### 6. Production protection
Customer-facing technical details are never exposed. If a production capability degrades, the system should prefer graceful fallback/containment and preserve data integrity. The agent must support rollback to the last known-good release when post-change health checks degrade.

### 7. Approval policy
Automatic repair is allowed only for low-risk, well-understood classes such as deterministic CI configuration/toolchain failures and known test fixes. Changes involving authentication/authorization, payments, order/refund logic, database migrations, security controls, production business rules, or destructive operations require explicit human approval.

## Non-goals
- No claim of literal zero defects or guaranteed 100% uptime.
- No autonomous weakening of security controls.
- No direct production database mutation by the agent.
- No secret extraction or secret logging.
- No automatic merge of high-risk changes.

## Observability contract
Every agent action must emit a structured audit record containing: failure signature, diagnosis, files inspected, files changed, tests executed, verification result, approval state, and resulting commit/PR. Logs must be searchable by run ID, commit SHA, failure signature, workflow/job, and component.

## Recovery contract
If a repair reaches a deployment stage and health checks regress, the system must stop further rollout and restore the last known-good version where supported. The failure and rollback evidence becomes a new knowledge-base entry.

## Success criteria
1. A CI failure can be traced from workflow run to exact failed stage and diagnostic evidence without manual repository-wide searching.
2. Repeated known failures are recognized from prior signatures.
3. Low-risk fixes can be prepared automatically in an isolated change with verification evidence.
4. High-risk changes stop for human approval.
5. A failed repair cannot silently replace a healthy production version.
6. Customer-visible responses remain safe and non-technical during internal failures.
7. Every automated action is auditable and reproducible.

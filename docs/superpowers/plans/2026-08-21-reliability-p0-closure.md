# Reliability P0 Closure Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Finish and continuously verify the repository-side reliability gates required for KhadakX production readiness without weakening the existing green baseline.

**Architecture:** Keep reliability logic framework-agnostic in `apps/reliability`, expose API health/readiness through the Nest API, and make CI execute both application and reliability-domain tests. Control Plane remains the safety boundary for autonomous actions; production infrastructure evidence remains outside repository-only verification.

**Tech Stack:** TypeScript, NestJS, Prisma, Jest, pnpm, GitHub Actions.

**Spec:** `docs/reliability/CHAT-CONTINUITY-BACKUP.md` and P0 issue #8.

## Global Constraints

- Existing green Build/Runtime E2E baseline must remain green.
- No production secrets in Git.
- No merge/deploy while a required gate is unverified.
- Failed gates become blockers and are fixed before release.
- Infrastructure gates require real Render evidence and are not fabricated by repository CI.

---

### Task 1: Health/readiness gate

**Files:** Existing `apps/api/src/health/*` and tests.

- [x] Implement dependency-independent liveness.
- [x] Implement database-aware readiness.
- [x] Return HTTP 503 on failed readiness.
- [x] Cover healthy/unhealthy dependency behavior with unit tests.

### Task 2: Reliability-domain gates

**Files:** `apps/reliability/src/observability/*`, `resilience/*`, `control-plane/*`, `headroom/*`, `knowledge/*`, `history/*`, `evidence/*`, `cto/*`, `escalation/*`.

- [x] Observability primitives and tests.
- [x] Circuit breaker/idempotency primitives and tests.
- [x] Control Plane freeze/resume and repeated-failure protection tests.
- [x] TAT/escalation/recurrence/permanent-fix policy tests.
- [x] Evidence/history/CTO digest support.

### Task 3: CI verification

**Files:** `.github/workflows/build.yaml`.

- [ ] Add a dedicated reliability-domain test job.
- [ ] Run it on the same PR/push protection path as the application build.
- [ ] Keep application Build and Runtime E2E unchanged as release gates.

### Task 4: Fresh verification

- [ ] Trigger fresh Build and Runtime E2E for the final branch commit.
- [ ] Verify every job is successful.
- [ ] Inspect failures before retrying; no blind retries.
- [ ] Update the P0 issue with evidence.

### Task 5: Production boundary

- [ ] Do not claim production configuration, DB backup/restore, rollback, or smoke-test gates until Render access provides fresh evidence.

# Agent Reliability & CTO Gateway Platform Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a production-oriented reliability control plane that records every agent incident, enforces TAT, detects recurrence, manages AI headroom, generates CTO digests, and escalates unresolved work safely.

**Architecture:** Introduce a dedicated `apps/reliability` service responsible for event ingestion, incident state, recurrence fingerprints, TAT calculations, CTO digest generation, escalation routing, and headroom policy. Persist operational data in the existing database package and expose a protected dashboard/API surface through the existing API/admin applications rather than coupling reliability logic to any individual agent.

**Tech Stack:** Existing pnpm workspace, TypeScript/NestJS patterns already used by `apps/api`, existing database package/Prisma, GitHub Actions, and the existing web/admin stack. Do not introduce a second persistence technology unless repository inspection proves the existing database package cannot support the required records.

**Spec:** `docs/superpowers/specs/2026-08-19-agent-cto-reliability-platform-design.md`

## Global Constraints

- Preserve the existing application architecture and workspace conventions.
- Every reliability-relevant event must be attributable to an agent ID and agent version.
- Never store secrets or access tokens in incident evidence.
- Raw evidence must be immutable; corrected interpretations are new incident revisions/events.
- P0/P1 and protected actions must never depend solely on a 30-minute heartbeat.
- The Main Agent cannot close an incident without verification evidence.
- Headroom may optimize routing but may not lower safety/verification requirements.
- Destructive production actions remain approval-gated.
- Historical incidents and solutions must remain searchable after resolution.

---

### Task 1: Establish the reliability domain package

**Files:**
- Create: `apps/reliability/package.json`
- Create: `apps/reliability/tsconfig.json`
- Create: `apps/reliability/src/domain/incident.ts`
- Create: `apps/reliability/src/domain/agent.ts`
- Create: `apps/reliability/src/domain/tat.ts`
- Create: `apps/reliability/src/domain/failure-dna.ts`
- Create: `apps/reliability/src/domain/reliability-event.ts`
- Test: `apps/reliability/src/domain/*.spec.ts`

**Interfaces:**
- `IncidentSeverity = 'P0' | 'P1' | 'P2' | 'P3' | 'P4'`
- `IncidentStatus = 'OPEN' | 'INVESTIGATING' | 'MITIGATED' | 'RESOLVED' | 'ESCALATED'`
- `ReliabilityEvent` must include `eventId`, `occurredAt`, `agentId`, `agentVersion`, `eventType`, `severity`, `correlationId`, and a sanitized evidence reference.
- `FailureFingerprint` must be deterministic from workflow/service/operation/error-class/environment fields.
- `calculateTatDeadline(severity, detectedAt)` must implement the approved P0-P4 target windows.

- [ ] **Step 1: Write failing tests for severity-to-TAT mapping and deterministic failure fingerprints.**
- [ ] **Step 2: Run `pnpm --filter reliability test` and verify the tests fail because the domain package does not exist.**
- [ ] **Step 3: Implement the domain types and pure TAT/fingerprint functions with no I/O.**
- [ ] **Step 4: Run the package tests and verify all domain tests pass.**
- [ ] **Step 5: Commit the isolated domain package.**

---

### Task 2: Add persistent incident and agent reliability records

**Files:**
- Modify: `packages/db/schema.prisma`
- Create: `apps/reliability/src/persistence/incident-repository.ts`
- Create: `apps/reliability/src/persistence/agent-repository.ts`
- Create: `apps/reliability/src/persistence/evidence-repository.ts`
- Test: `apps/reliability/src/persistence/*.spec.ts`

**Interfaces:**
- `IncidentRepository.create(input) -> Incident`
- `IncidentRepository.getById(id) -> Incident | null`
- `IncidentRepository.findByFingerprint(fingerprint) -> Incident[]`
- `IncidentRepository.recordEvent(incidentId, event) -> void`
- `AgentRepository.upsertIdentity(agent) -> Agent`
- `EvidenceRepository.addReference(input) -> EvidenceReference`

- [ ] **Step 1: Write tests covering incident creation, recurrence lookup, agent identity/version, immutable evidence references, and resolution records.**
- [ ] **Step 2: Run the persistence tests and verify failure against the missing schema/repository methods.**
- [ ] **Step 3: Add Prisma models for `AgentIdentity`, `ReliabilityIncident`, `ReliabilityEvent`, `EvidenceReference`, `IncidentResolution`, and `IncidentVerification` with indexes on agent, severity, status, fingerprint, workflow, and timestamps.**
- [ ] **Step 4: Implement repository methods using the existing database package conventions.**
- [ ] **Step 5: Run database generation and the persistence tests.**
- [ ] **Step 6: Commit the persistence layer and migration.**

---

### Task 3: Build sanitized evidence capture and incident ingestion

**Files:**
- Create: `apps/reliability/src/ingestion/event-ingestor.ts`
- Create: `apps/reliability/src/ingestion/evidence-sanitizer.ts`
- Create: `apps/reliability/src/ingestion/incident-correlator.ts`
- Test: `apps/reliability/src/ingestion/*.spec.ts`

**Interfaces:**
- `ingestReliabilityEvent(event) -> IngestionResult`
- `sanitizeEvidence(raw) -> SanitizedEvidence`
- `correlateEvent(event) -> IncidentCorrelation`

- [ ] **Step 1: Write tests proving secrets, authorization headers, cookies, tokens, and environment secrets are removed before persistence.**
- [ ] **Step 2: Write tests proving events with the same Failure DNA and active correlation are attached to one incident instead of creating duplicates.**
- [ ] **Step 3: Implement sanitization using explicit allow-listed fields and deterministic redaction.**
- [ ] **Step 4: Implement incident correlation and event persistence.**
- [ ] **Step 5: Run ingestion tests and verify sanitized output and correlation behavior.**
- [ ] **Step 6: Commit the evidence/ingestion layer.**

---

### Task 4: Implement recurrence and permanent-fix intelligence

**Files:**
- Create: `apps/reliability/src/intelligence/recurrence-engine.ts`
- Create: `apps/reliability/src/intelligence/permanent-fix-score.ts`
- Create: `apps/reliability/src/intelligence/root-cause-clusters.ts`
- Test: `apps/reliability/src/intelligence/*.spec.ts`

**Interfaces:**
- `calculateRecurrence(fingerprint) -> RecurrenceSummary`
- `scorePermanentFix(resolution, verification) -> PermanentFixScore`
- `clusterRootCauses(incidents) -> RootCauseCluster[]`

- [ ] **Step 1: Write tests for occurrence counts, recurrence intervals, repeated workarounds, and verified permanent fixes.**
- [ ] **Step 2: Run tests and verify failure.**
- [ ] **Step 3: Implement recurrence calculations and Permanent Fix Score from the approved model: workaround 20, configuration adjustment 40, root-cause fix 70, root-cause plus regression 85, architectural prevention 100.**
- [ ] **Step 4: Implement root-cause clustering around Failure DNA and normalized cause labels.**
- [ ] **Step 5: Run tests and verify recurrence and scoring.**
- [ ] **Step 6: Commit the intelligence layer.**

---

### Task 5: Implement TAT engine and escalation manager

**Files:**
- Create: `apps/reliability/src/escalation/tat-engine.ts`
- Create: `apps/reliability/src/escalation/escalation-manager.ts`
- Create: `apps/reliability/src/escalation/expert-routing.ts`
- Test: `apps/reliability/src/escalation/*.spec.ts`

**Interfaces:**
- `getTatState(incidentId) -> TatState`
- `predictTatBreach(incident) -> TatPrediction`
- `routeEscalation(incident) -> EscalationDecision`

- [ ] **Step 1: Write tests for all P0-P4 deadlines, warning thresholds, immediate P0 escalation, and TAT-breach prediction.**
- [ ] **Step 2: Write tests proving unresolved incidents escalate from specialist to Main Agent and then to a domain human expert without requiring owner intervention.**
- [ ] **Step 3: Implement the TAT clock and prediction engine.**
- [ ] **Step 4: Implement expert routing using incident domain plus historical resolution performance.**
- [ ] **Step 5: Run tests and verify escalation decisions.**
- [ ] **Step 6: Commit the TAT/escalation layer.**

---

### Task 6: Implement Headroom AI budget and routing policy

**Files:**
- Create: `apps/reliability/src/headroom/budget-policy.ts`
- Create: `apps/reliability/src/headroom/task-router.ts`
- Create: `apps/reliability/src/headroom/loop-detector.ts`
- Test: `apps/reliability/src/headroom/*.spec.ts`

**Interfaces:**
- `selectExecutionRoute(task, context) -> ExecutionRoute`
- `recordUsage(usage) -> void`
- `detectLoop(taskHistory) -> LoopAssessment`

- [ ] **Step 1: Write tests proving known low-risk fixes route to specialists before Main Agent/CTO reasoning.**
- [ ] **Step 2: Write tests proving repeated retries exceed budget and stop rather than consuming unbounded credits.**
- [ ] **Step 3: Implement configurable budgets for token/time/retry counts with safe defaults.**
- [ ] **Step 4: Implement route selection using capability, historical success, severity, and required verification level.**
- [ ] **Step 5: Implement loop detection and forced escalation.**
- [ ] **Step 6: Run tests and commit the Headroom layer.**

---

### Task 7: Implement Main Agent CTO digest and interrupt protocol

**Files:**
- Create: `apps/reliability/src/cto/digest-builder.ts`
- Create: `apps/reliability/src/cto/cto-gateway.ts`
- Create: `apps/reliability/src/cto/interrupt-policy.ts`
- Test: `apps/reliability/src/cto/*.spec.ts`

**Interfaces:**
- `buildCtoDigest(windowStart, windowEnd) -> CtoDigest`
- `shouldInvokeCto(digest) -> CtoInvocationDecision`
- `shouldInterruptCto(event) -> boolean`
- `invokeCto(digest, evidenceRefs) -> CtoDecision`

- [ ] **Step 1: Write tests for 30-minute digest generation, no-change suppression, material-change invocation, and P0 immediate interrupt.**
- [ ] **Step 2: Write tests proving raw logs are not sent when a compact evidence summary is sufficient.**
- [ ] **Step 3: Implement digest aggregation across incidents, workflows, agent health, TAT, recurrence, headroom, and known-good state.**
- [ ] **Step 4: Implement the CTO gateway boundary so model credentials and provider details are isolated from specialist agents.**
- [ ] **Step 5: Implement the interrupt policy for P0/security/data-loss/payment/rollback/TAT-breach/deadlock events.**
- [ ] **Step 6: Run tests and commit the CTO gateway layer.**

---

### Task 8: Add protected reliability API and scheduled worker

**Files:**
- Create: `apps/reliability/src/main.ts`
- Create: `apps/reliability/src/api/reliability.controller.ts`
- Create: `apps/reliability/src/api/reliability.module.ts`
- Create: `apps/reliability/src/scheduler/heartbeat-worker.ts`
- Create: `apps/reliability/Dockerfile`
- Modify: `apps/docker-compose.yaml`
- Test: `apps/reliability/src/api/*.spec.ts`

**Interfaces:**
- `POST /reliability/events`
- `GET /reliability/incidents/:id`
- `GET /reliability/agents`
- `GET /reliability/summary`
- `POST /reliability/incidents/:id/escalate`
- `POST /reliability/incidents/:id/verify`

- [ ] **Step 1: Write API tests for authenticated event ingestion, incident lookup, agent health, summary, escalation, and verification.**
- [ ] **Step 2: Run API tests and verify failure before the service is wired.**
- [ ] **Step 3: Implement the protected NestJS-style service/API following `apps/api` conventions.**
- [ ] **Step 4: Implement the 30-minute scheduler with idempotent window keys so retries cannot create duplicate CTO digests.**
- [ ] **Step 5: Add the reliability service to local orchestration without exposing it publicly by default.**
- [ ] **Step 6: Run API tests and build the reliability service.**
- [ ] **Step 7: Commit the service/orchestration layer.**

---

### Task 9: Add agent health, workflow, and incident dashboards

**Files:**
- Modify: `apps/admin` or the existing admin dashboard selected after repository inspection
- Create: `apps/reliability/src/reporting/metrics.ts`
- Create: `apps/reliability/src/reporting/dashboard-query.ts`
- Test: `apps/reliability/src/reporting/*.spec.ts`

**Interfaces:**
- `getSystemHealth(range) -> SystemHealth`
- `getAgentHealth(range) -> AgentHealth[]`
- `getWorkflowHealth(range) -> WorkflowHealth[]`
- `getRecurrenceReport(range) -> RecurrenceReport`
- `getHeadroomReport(range) -> HeadroomReport`

- [ ] **Step 1: Write metric tests using normalized error rate rather than raw incident count.**
- [ ] **Step 2: Implement system/agent/workflow/TAT/recurrence/headroom query functions.**
- [ ] **Step 3: Add dashboard views for health, incidents, recurrence, Failure DNA, TAT, AI usage, escalation, and CTO decisions using the existing admin UI conventions.**
- [ ] **Step 4: Add drill-down from a metric to the underlying incident evidence.**
- [ ] **Step 5: Run dashboard tests and the admin build.**
- [ ] **Step 6: Commit the dashboard layer.**

---

### Task 10: Add agent integration contract and workflow telemetry

**Files:**
- Create: `packages/reliability-contract/src/index.ts`
- Create: `packages/reliability-contract/package.json`
- Modify: relevant GitHub workflow files after inventory
- Test: `packages/reliability-contract/src/*.spec.ts`

**Interfaces:**
- `ReliabilityReporter.emit(event) -> Promise<void>`
- `withReliabilityContext(context, operation) -> Promise<Result>`
- `AgentIdentity` contract shared by all agents

- [ ] **Step 1: Write contract tests proving all agents can emit the same event schema and correlation ID.**
- [ ] **Step 2: Implement the shared package with no provider-specific model code.**
- [ ] **Step 3: Instrument CI/runtime-E2E workflows to emit workflow/run/job/step lifecycle events and sanitized failure evidence.**
- [ ] **Step 4: Add agent registration/version events for each existing specialist.**
- [ ] **Step 5: Run contract tests and the affected CI/E2E workflows.**
- [ ] **Step 6: Commit telemetry integration.**

---

### Task 11: Add known-good state, regression detection, and safety gates

**Files:**
- Create: `apps/reliability/src/regression/known-good-state.ts`
- Create: `apps/reliability/src/regression/regression-detector.ts`
- Create: `apps/reliability/src/safety/action-policy.ts`
- Test: `apps/reliability/src/regression/*.spec.ts`
- Test: `apps/reliability/src/safety/*.spec.ts`

**Interfaces:**
- `recordKnownGood(snapshot) -> KnownGoodState`
- `compareAgainstKnownGood(current) -> RegressionReport`
- `authorizeAction(action, evidence) -> ActionAuthorization`

- [ ] **Step 1: Write tests proving a known-good commit is recorded only after CI/E2E/required checks pass.**
- [ ] **Step 2: Write tests proving protected actions are denied without required approval/evidence.**
- [ ] **Step 3: Implement known-good snapshots and regression comparison.**
- [ ] **Step 4: Implement action authorization for diagnostics versus protected production actions.**
- [ ] **Step 5: Run tests and commit the safety/regression layer.**

---

### Task 12: End-to-end verification and operational runbook

**Files:**
- Create: `docs/reliability/OPERATIONS.md`
- Create: `docs/reliability/INCIDENT-LIFECYCLE.md`
- Create: `docs/reliability/CTO-GATEWAY.md`
- Create: `docs/reliability/AGENT-CONTRACT.md`
- Create: `docs/reliability/DASHBOARD.md`
- Test: `apps/reliability/test/reliability.e2e-spec.ts`

- [ ] **Step 1: Write an E2E scenario that injects a synthetic CI failure event and verifies incident creation, evidence sanitization, TAT calculation, recurrence lookup, escalation, fix record, and Main Agent verification.**
- [ ] **Step 2: Write an E2E scenario for a repeated failure and verify that the Permanent Fix Score and architecture-level recommendation are produced.**
- [ ] **Step 3: Write an E2E scenario for a P0 event and verify immediate CTO interrupt without waiting for the 30-minute heartbeat.**
- [ ] **Step 4: Write an E2E scenario for an agent retry loop and verify Headroom stops the loop and escalates.**
- [ ] **Step 5: Document incident handling, TAT, escalation, protected actions, dashboard interpretation, and CTO digest semantics.**
- [ ] **Step 6: Run workspace lint, unit tests, build, reliability E2E, and existing Runtime E2E.**
- [ ] **Step 7: Review the final evidence against the design spec and create a PR only after all required gates pass.**

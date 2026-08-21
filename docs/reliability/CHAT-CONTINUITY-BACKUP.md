# KhadakX — CTO Continuity & Release Control Backup

## Authoritative operating rule
Detect → Understand → Act → Verify → Learn → Prevent recurrence → Escalate when necessary.

**Hard rule:** No gate is GREEN without fresh evidence for the exact release SHA. Evidence from another branch, SHA, deployment, or historical run must never be inherited.

## Agent fleet contracts
- **CI Agent:** GREEN only with fresh Build + Runtime E2E evidence for the exact release SHA.
- **Security Agent:** GREEN only with a fresh dependency/security result for the exact release SHA; never use blind force upgrades.
- **Health Agent:** GREEN only with implementation tests plus runtime liveness/readiness evidence.
- **Reliability Agent:** verify observability, resilience, idempotency, recurrence, incident handling, loop protection and governance.
- **Infrastructure Agent:** verify Render deploy, runtime, DB connectivity, backup, restore and rollback evidence.
- **Governance Agent:** enforce owner, TAT, evidence requirements, escalation and release freeze.
- **Continuity Agent:** persist failure DNA, root cause, fix, verification and prevention notes.
- **CTO Gate:** GO only when all applicable hard gates have evidence; otherwise NO-GO with exact blockers.

## Failure DNA / lessons learned
1. Feature branch green != current main green.
2. Pre-merge green != post-merge green.
3. Code present != deployed.
4. Render LIVE != endpoint smoke verified.
5. DB connectivity != recoverability.
6. Reliability components != continuously running autonomous workers.
7. Security workflow present != security gate passed.
8. Historical CI != current release evidence.
9. Divergent PRs must be reconciled deliberately; never blindly merge large stale branches.
10. Render surfaced critical/high dependency vulnerabilities; exact advisories must be identified and safely remediated.
11. Render PostgreSQL Free/expiring status must be resolved explicitly before production approval.
12. Missing evidence is RED, not implicit GREEN.

## Required release evidence record
For every release: RELEASE_ID, COMMIT_SHA, WORKFLOW_RUN_ID, RENDER_DEPLOY_ID, TEST_RESULT, SECURITY_RESULT, HEALTH_RESULT, SMOKE_RESULT, BACKUP_ID, RESTORE_RESULT, ROLLBACK_RESULT, OWNER, TAT, ESCALATION_LEVEL, ROOT_CAUSE, FIX, VERIFICATION, PREVENTION, FINAL_DECISION.

## Current release state
The repository has a verified reliability platform integrated into main and deployed to Render. Final production approval remains blocked until the exact current release SHA has fresh CI/security evidence and the runtime, DB recovery and rollback gates are evidenced.

## Current known P0 gates
- Fresh CI on exact release SHA
- Fresh security audit/remediation evidence
- Production health/readiness request evidence
- Production smoke
- Safe DB backup and restore verification
- Deployment rollback verification
- Production database durability/expiry decision
- Final CTO gate

## Safety / prevention
- Never invent CI, backup, restore, rollback or production smoke evidence.
- Never commit production secrets.
- Never run a destructive restore against the only production database without an isolated/safe target.
- Never deploy an unverified SHA.
- A workaround is not a permanent fix until recurrence is monitored.
- TAT expiry or missing required evidence must escalate and keep release frozen.

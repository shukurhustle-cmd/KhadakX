# Release Control Plane

This is the execution contract for release evidence. It operates inside the frozen Specialist → Main/Orchestrator → CTO architecture.

## Control loop
1. Create a release record for an exact COMMIT_SHA.
2. Assign every applicable hard gate to its specialist owner.
3. Each owner records evidence or explicitly records UNOBSERVABLE/FAILED/BLOCKED.
4. The Main/Orchestrator consumes the evidence packet, re-diagnoses unresolved items, and coordinates remediation.
5. TAT expiry, two failed verifications, missing capability, or material production/security/data-recovery risk escalates to Main.
6. Unresolved Main work or CTO-authority decisions escalate to CTO.
7. CTO evaluates the complete evidence set and returns GO, NO-GO, or PENDING.

## Gate registry
- CI: exact-SHA Build and required tests.
- Security: exact-SHA dependency/security audit and remediation evidence.
- Runtime E2E: exact-SHA runtime verification.
- Health: production liveness/readiness evidence.
- Smoke: production critical-path smoke evidence.
- Backup: safe production backup evidence.
- Restore: isolated/safe restore or recovery verification.
- Rollback: validated rollback/recovery evidence.
- DB durability: production persistence/expiry decision and evidence.
- Governance: owner, TAT, escalation, evidence completeness.

## Evidence semantics
GREEN = fresh evidence tied to exact SHA.
RED = verified failure tied to exact SHA.
YELLOW = incomplete/unobservable evidence with owner and TAT.
BLOCKED = cannot safely execute because dependency/capability is missing.

UNOBSERVABLE must never be converted into GREEN or silently treated as FAILED. It becomes an evidence task with an owner, TAT and escalation route.

## Hard release rule
No deployment or GO decision may rely on historical evidence. If a new commit becomes the release candidate, all applicable evidence must be re-attributed to that exact SHA.

## Anti-loop rule
Every attempt records what was tried and what changed. Identical retries without new evidence are prohibited. The specialist escalates to Main; Main escalates to CTO; CTO decides the next action.

## CTO output
The final record must contain:
- decision: GO | NO-GO | PENDING
- exact release SHA
- gate matrix
- evidence references
- unresolved risks
- residual risk acceptance, if any
- rollback/freeze decision when applicable
- prevention action
- timestamp and decision owner

## Safety
No agent may expose secrets, bypass a release gate, deploy an unverified SHA, or perform destructive database recovery against the only production target without an approved safe target.

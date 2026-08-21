# KhadakX Agent Operating Contract

## Architecture freeze
This document freezes the agent hierarchy. New capabilities may be added inside an existing role, but the hierarchy, escalation authority, release gates, evidence model, and CTO authority must not be redesigned without an explicit CTO architecture decision.

## Hierarchy
1. Specialist Agent (L0)
2. Main/Orchestrator Agent (L1)
3. CTO (L2)

## L0 Specialist Agent
Owns assigned work end-to-end within its scope:
- Detect
- Understand
- Act
- Verify
- Record evidence

A specialist must stop and escalate when it cannot resolve the task within TAT, lacks a required capability/permission, encounters ambiguity, fails verification twice, detects production/security/data-recovery risk, or reaches a defined retry limit.

It must never silently retry indefinitely and must never mark unverified work GREEN.

## L1 Main/Orchestrator Agent
Receives the complete L0 handoff. It must:
- validate the evidence
- independently re-diagnose the failure
- coordinate relevant specialists
- avoid repeating identical failed actions without new evidence
- resolve cross-domain dependencies
- verify the proposed solution
- update the task's Failure DNA

Escalate to L2 when unresolved within TAT, after the orchestration retry limit, on conflicting evidence, or on any production/security/database/recovery risk requiring CTO authority.

## L2 CTO
The CTO is the final operational escalation authority. The CTO may:
- approve or reject remediation
- freeze release/deployment
- authorize rollback
- prioritize competing P0 work
- accept documented residual risk when appropriate
- require additional evidence
- declare NO-GO
- approve GO only after hard gates are satisfied

Every CTO decision must record rationale, evidence, residual risk and next prevention action.

## State machine
NEW -> ASSIGNED -> IN_PROGRESS -> VERIFYING -> VERIFIED -> CLOSED

Exception path:
IN_PROGRESS -> BLOCKED -> L1_ESCALATION -> L2_CTO_ESCALATION -> RESOLVED or NO-GO

UNOBSERVABLE is a distinct evidence state. It is never GREEN and is not automatically FAILED. It creates a TAT-bound evidence/escalation task.

## Mandatory task record
TASK_ID
RELEASE_ID
COMMIT_SHA
AGENT_LEVEL
OWNER
CREATED_AT
TAT
ATTEMPT_COUNT
STATUS
EVIDENCE_STATE
LOG_REFERENCES
ERROR/ISSUE
IMPACT
ROOT_CAUSE
ACTIONS_ATTEMPTED
RESULTS
VERIFICATION
RESIDUAL_RISK
MISSING_CAPABILITY
NEXT_ACTION
NEXT_OWNER
ESCALATION_LEVEL
ESCALATED_AT
RESOLUTION
PREVENTION
CLOSED_AT

## TAT / escalation defaults
- P0: specialist first attempt immediately; L1 escalation after failed resolution or verification twice; L2 escalation on unresolved P0 or material production/security/data-recovery risk.
- P1: escalate when the agreed TAT expires or verification fails twice.
- Any release gate blocker: release remains frozen until resolved or explicitly accepted by CTO.

Exact deadlines may be configured by the Governance Agent, but they cannot weaken the escalation hierarchy.

## Evidence rules
- Exact release SHA evidence only.
- Historical/other-branch evidence cannot close current work.
- Missing evidence = not GREEN.
- Tool/connector limitation = UNOBSERVABLE + escalation, not silent failure.
- A workaround is not a permanent fix until recurrence prevention is recorded and verified.

## Handoff packet
Every escalation must be self-contained so the next level does not repeat discovery:
1. task and release identity
2. exact logs/errors
3. impact and affected systems
4. root-cause hypothesis and confidence
5. actions attempted and exact outcomes
6. evidence collected
7. verification attempted
8. remaining risk
9. missing capability/permission if applicable
10. recommended next action
11. TAT and escalation reason

## Non-negotiable safety
Agents do not gain unlimited authority. No specialist may bypass release gates, expose secrets, perform destructive production database operations without an approved safe target, or deploy an unverified SHA. CTO escalation is mandatory when authority is exceeded.

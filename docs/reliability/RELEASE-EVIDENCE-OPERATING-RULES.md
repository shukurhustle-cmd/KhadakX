# Release Evidence Operating Rules

This is the machine-operable evidence contract for the frozen Specialist → Main/Orchestrator → CTO architecture.

## Gate semantics
- GREEN = fresh, attributable evidence exists for the exact `commit_sha`.
- RED = verified failure exists for the exact `commit_sha`.
- YELLOW = evidence is incomplete or currently unobservable; owner and TAT are mandatory.
- BLOCKED = execution cannot proceed because an explicit dependency/capability is missing.

## Evidence identity
Every evidence item must be attributable to the exact release SHA. A different branch, SHA, deployment, or historical workflow run cannot satisfy a current gate.

## Required gates
`ci`, `security`, `runtime_e2e`, `health`, `smoke`, `backup`, `restore`, `rollback`, `db_durability`, `governance`.

## Closure rule
A release may become `GO` only when every applicable hard gate is GREEN and the evidence record identifies the exact SHA and verification timestamps. Any RED hard gate produces `NO-GO`. Any YELLOW hard gate produces `PENDING`, never GREEN.

## Escalation rule
A gate owner gets the first attempt. On failed verification twice, missing capability, unresolved dependency, or TAT expiry, the item escalates to the Main/Orchestrator Agent. If unresolved there, or if CTO authority is required, it escalates to the CTO.

## No silent loops
Every retry increments `attempt_count` and records what changed between attempts. Repeating the same action without new evidence is prohibited.

## Evidence lifecycle
`OPEN → EVIDENCE_PENDING → VERIFIED/FAILED → CLOSED`.

`UNOBSERVABLE` is an evidence state, not a success state. It requires an evidence request, owner and TAT.

## Release decision
The evidence record is authoritative for the release decision. CI badges, Render LIVE status, or agent assertions alone do not authorize GO.

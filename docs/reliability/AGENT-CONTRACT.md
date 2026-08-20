# Agent Reliability Contract

Every specialist agent must identify itself with a stable `agentId` and `agentVersion` and emit reliability events for reliability-relevant operations.

## Minimum event fields

- `eventId`
- `occurredAt`
- `agentId`
- `agentVersion`
- `eventType`
- `severity`
- `correlationId`
- `workflow`
- `operation`
- `status`
- sanitized evidence reference

## Required behavior

1. Do not expose secrets in evidence.
2. Reuse correlation IDs across retries of the same operation.
3. Stop retry loops when Headroom signals a budget or loop breach.
4. Record diagnosis confidence.
5. Record the fix and verification evidence.
6. Never close an incident without Main Agent verification.

# KhadakX Reliability Foundation

This package is the shared reliability-domain foundation for KhadakX agents.

## Responsibilities

- Stable agent identity metadata
- Structured incident and reliability events
- Severity-aware turnaround-time (TAT) rules
- Deterministic Failure DNA fingerprints

The package is intentionally framework-agnostic. Persistence, GitHub ingestion, scheduling, model routing, dashboards, and protected actions will be added in later slices.

## Safety boundary

This package performs no production mutations and has no autonomous deployment, secret, database, or force-push capability.

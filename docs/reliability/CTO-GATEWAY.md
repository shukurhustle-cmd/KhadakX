# CTO Gateway Operating Model

The CTO Gateway is an always-available service boundary for technical review. It is not tied to an open ChatGPT mobile conversation.

## Invocation

- Scheduled: Main Agent creates an idempotent digest every 30 minutes.
- Suppressed: no model invocation when there is no material change and no decision is required.
- Immediate: P0, security, data loss, payment failure, rollback failure, TAT breach, agent deadlock, or material agent disagreement.

## Digest contents

- system health
- active incidents and severity
- TAT remaining and predicted breaches
- CI/E2E/workflow health
- recurring Failure DNA patterns
- permanent-fix candidates
- agent health and escalation rate
- Headroom usage and retry/loop anomalies
- last-known-good state
- decisions requested from CTO

## Safety

The CTO Gateway may recommend or authorize only actions allowed by the action policy. Destructive production actions, secret changes, force pushes, destructive database operations, and critical merges require explicit approval.

## Owner interaction

The business owner receives concise business-language summaries. Technical evidence remains linked to the incident record. The owner is not required to inspect source code to understand whether an action is needed.

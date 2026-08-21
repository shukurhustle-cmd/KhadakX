# KhadakX Production Backup & Rollback Runbook

## Release gate

A release must have a known-good commit SHA, a recorded database backup, and a tested rollback target before production rollout.

## Pre-deployment

- Record the exact release commit SHA.
- Confirm Build and Runtime E2E are green for that SHA.
- Create a database backup using the production database provider's native backup/snapshot mechanism.
- Record backup ID, creation time, database version, and retention policy in the deployment evidence store.
- Verify the backup is readable/restorable without exposing credentials.
- Confirm the previous known-good application release remains available.
- Confirm required production secrets are present in the deployment platform secret manager.

## Rollback trigger

Rollback immediately when a production smoke test fails, error rate breaches the release threshold, authentication is broken, data integrity is uncertain, or a critical integration is unavailable.

## Application rollback

1. Stop or pause progressive rollout.
2. Redeploy the previous known-good commit SHA.
3. Run health checks.
4. Run production smoke tests.
5. Keep the incident open until verification completes.

## Database rollback

Database rollback is **not** an automatic application rollback step. Use restore only when data corruption or an incompatible migration is confirmed and the recovery plan has been reviewed. Prefer forward-fix migrations where safe.

## Evidence preservation

Reliability evidence, incident records, deployment IDs, and rollback decisions must live outside the application release artifact so they survive an application rollback.

## Recovery objective

The deployment platform must define and document RPO/RTO targets before production approval. The release is blocked if the operator cannot identify the current backup and restore mechanism.

## Verification checklist

- [ ] Release commit recorded
- [ ] Previous known-good commit recorded
- [ ] Database backup created
- [ ] Backup restore/readability verified
- [ ] Secret-manager configuration verified
- [ ] Application rollback procedure verified
- [ ] Health check verified after rollback
- [ ] Smoke tests verified after rollback
- [ ] Reliability evidence remains available after rollback
- [ ] RPO/RTO documented
- [ ] CTO/release owner approves production rollout

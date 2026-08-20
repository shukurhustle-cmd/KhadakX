# Production Environment Readiness Gate

This document defines the production environment contract without storing any secret values in Git.

## Required API configuration

- `NODE_ENV=production`
- `PORT`
- `JWT_SECRET`
- `JWT_EXPIRES_IN`
- `CORS_ORIGINS`
- `ADFORGE_WEBHOOK_URL`
- `ADFORGE_WEBHOOK_SECRET`
- `ADFORGE_API_KEY`

The canonical non-secret variable names are documented in `apps/api/.env.example`.

## Rules

1. Production secrets MUST come from the deployment platform's secret manager/environment configuration.
2. No real secret values may be committed to Git.
3. `JWT_SECRET` must be a long, randomly generated production secret and must differ from development/test values.
4. `CORS_ORIGINS` must contain only the intended production origins; localhost must not be used in production.
5. AdForge webhook URL, secret, and API key must be configured before production health is considered ready.
6. Health checks must verify required configuration without exposing secret values.
7. A missing required production variable is a release blocker.
8. Rotation must be possible without changing application source code.

## Release evidence

A production release is considered configuration-ready only when the deployment environment reports all required variables as present and the application health check confirms the integration configuration without returning secret contents.

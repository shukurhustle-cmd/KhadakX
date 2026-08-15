# KhadakX Production Deployment

## Render API service

- Runtime: Docker
- Root directory: `apps/api`
- Dockerfile: `apps/api/Dockerfile`
- Port: Render-provided `PORT` (the Nest app listens on `PORT`, default 4000 locally)
- Health check: `/health`
- Readiness check: `/ready`
- Start command is defined by the Docker image.

## Required API environment variables

- `NODE_ENV=production`
- `PORT` (Render supplies this)
- `DATABASE_URL` (managed PostgreSQL / Prisma connection string)
- `JWT_SECRET` (strong random secret; never commit it)
- `CORS_ORIGINS` (comma-separated production web origins)
- `ADFORGE_WEBHOOK_URL` when live outbound delivery to AdForge is enabled
- `ADFORGE_WEBHOOK_SECRET` when webhook signing is enabled

## Database

Run Prisma migrations as part of the deployment process before serving production traffic:

`npx prisma migrate deploy`

The application image runs `prisma generate` during build.

## Web service

- Runtime: Docker
- Root directory: `apps/web`
- Dockerfile: `apps/web/Dockerfile`
- Port: 3000
- Start command: `npm start`

Set the production API base URL using the web application's existing environment variable convention.

## Secrets

Never commit `.env`, provider OAuth secrets, database passwords, JWT secrets, Meta tokens, Google refresh tokens, YouTube credentials, or AdForge webhook secrets.

Configure them in Render's Environment settings.

## Deployment order

1. Deploy API.
2. Run Prisma migrations.
3. Verify `/health` and `/ready`.
4. Deploy web.
5. Configure production CORS origin(s).
6. Configure OAuth callback URLs for Google/Meta/YouTube.
7. Enable AdForge webhook delivery only after the receiving endpoint is reachable.
8. Run end-to-end smoke tests for login, vendor/business context, listing/product, order, review, ride and campaign events.

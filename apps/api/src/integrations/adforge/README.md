# KhadakX → AdForge integration

KhadakX remains the specialized vertical/business operating system. AdForge remains the shared AI marketing, promotion, advertising and growth engine.

The integration now supports authenticated outbound event delivery from KhadakX to AdForge. MyArea growth events are normalized by KhadakX and can be delivered to AdForge without duplicating business identity, order, menu or customer records.

## Production configuration

Configure these variables on the KhadakX API Render service:

- `ADFORGE_WEBHOOK_URL` — the AdForge authenticated event-ingestion URL.
- `ADFORGE_WEBHOOK_SECRET` — a long random shared secret; store it only in Render secrets/environment configuration.

Both values are required before outbound delivery is reported as enabled.

## Event delivery

KhadakX sends a signed JSON event with:

- `X-KhadakX-Signature: sha256=<HMAC-SHA256>`
- `X-KhadakX-Event-Id`
- `X-KhadakX-Contract-Version: 1.3`

The sender retries transient failures up to three times with exponential backoff and a ten-second request timeout. Duplicate handling must use `eventId` as the idempotency key on the receiving side.

## Endpoints

- `GET /api/integrations/adforge/health`
- `POST /api/integrations/adforge/context/validate`
- `POST /api/integrations/adforge/events/validate`
- `GET /api/integrations/myarea/health`
- `POST /api/integrations/myarea/vendor/context`
- `POST /api/integrations/myarea/listing/event`
- `POST /api/integrations/myarea/order/event`
- `POST /api/integrations/myarea/events/normalize`

## Status semantics

The AdForge health endpoint reports `outboundEventsEnabled: true` only when both production webhook URL and shared secret are configured. It reports `degraded` when the application is healthy but outbound delivery has not been configured.

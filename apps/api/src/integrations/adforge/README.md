# KhadakX → AdForge integration contract

KhadakX remains the specialized vertical/business operating system. AdForge remains the shared AI marketing, promotion, advertising and growth engine.

This module establishes the first stable boundary between the two systems without duplicating authentication, customer identity, orders, menu data or business records.

## Endpoints

- `GET /api/integrations/adforge/health`
- `POST /api/integrations/adforge/context/validate`
- `POST /api/integrations/adforge/events/validate`

## Event contract

Supported event types are intentionally limited to the current growth lifecycle: business updates, product updates, campaign requests, leads and orders.

Real persistence, authenticated outbound delivery and provider-specific marketing APIs should be added on top of this contract rather than embedded in the KhadakX domain modules.

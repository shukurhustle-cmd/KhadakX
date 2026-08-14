# MyArea → KhadakX → AdForge bridge

MyArea remains the B2C/local marketplace and discovery system. KhadakX remains the specialized B2B/vertical operating layer. AdForge remains the shared marketing, promotion, advertising, SEO and growth engine.

This bridge normalizes MyArea vendor, listing and transaction data into the existing AdForge business/event contract. It intentionally does not duplicate MyArea authentication, MongoDB models, customer records, listings, orders or ride services.

## Current endpoints

- `GET /api/integrations/myarea/health`
- `POST /api/integrations/myarea/vendor/context`
- `POST /api/integrations/myarea/listing/event`
- `POST /api/integrations/myarea/order/event`
- `POST /api/integrations/myarea/events/normalize`

## Source mapping

MyArea's current Vendor model provides business name, description, phone, email, branding, category, status, location, address, plan, rating/review counts and transaction statistics. Its Listing model provides title, description, pricing, images, category, stock, ratings and tags. Its Order model provides customer/vendor identity, items, status, totals, payment state and review information.

The bridge converts those existing structures into the stable AdForge contract without hard-coding provider quotas or external API billing assumptions.

## Next runtime connection

The remaining runtime step is authenticated delivery from MyArea into these endpoints (or a shared event bus) when vendor/listing/order changes occur. Provider-specific Google, Meta, YouTube and other APIs remain downstream of AdForge.

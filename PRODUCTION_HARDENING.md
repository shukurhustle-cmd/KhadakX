# KhadakX production hardening

- API startup loads environment configuration and exposes `/health` and `/ready`.
- Global validation rejects unknown request properties and transforms DTO values.
- CORS is configurable through `CORS_ORIGINS`.
- Production JWT startup fails if `JWT_SECRET` is missing.
- MyArea and AdForge integration contracts share a stable business/event boundary.
- Shared MyArea capabilities are represented as marketplace capabilities: products, services, ordering, offers, reviews, QR menu and rides for both B2C and B2B businesses.
- Provider credentials remain outside source control.

AdForge owns third-party OAuth/publishing. KhadakX does not store vendor Meta/Google/YouTube secrets in source code.

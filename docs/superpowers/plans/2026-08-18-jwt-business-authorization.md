# JWT Business Authorization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make Business mutations derive identity from a verified JWT instead of a caller-supplied `userId`, while preserving the unified Business ID across MyArea, KhadakX, and AdForge.

**Architecture:** Reuse the existing NestJS `@nestjs/jwt` configuration and JWT claims already issued by `AuthService` (`sub`, `email`, `role`, `businessId`). Add a focused JWT guard that verifies the bearer token and exposes the verified claims as `req.user`; Business mutation endpoints then authorize membership using that server-derived user ID. Add regression coverage for authenticated owners, non-members, missing/invalid tokens, and forged body identities.

**Tech Stack:** NestJS 10, `@nestjs/jwt`, Prisma 5, TypeScript, Jest.

**Spec:** Approved in chat: JWT identity → authenticated user → Business membership → privileged operation.

## Global Constraints

- Preserve the existing unified Business ID and entitlement model.
- Do not trust `userId` supplied in privileged request bodies.
- Production requires `JWT_SECRET`; development may use the existing development fallback.
- Existing public login/register endpoints remain public.
- Existing MyArea/KhadakX/AdForge entitlement semantics remain unchanged.

---

### Task 1: Add JWT verification guard

**Files:**
- Create: `apps/api/src/modules/auth/jwt-auth.guard.ts`
- Modify: `apps/api/src/modules/auth/auth.module.ts`
- Test: `apps/api/src/modules/auth/jwt-auth.guard.spec.ts`

- [ ] Write failing tests for valid bearer token, missing token, malformed token, and invalid signature.
- [ ] Implement guard using the existing `JwtService` and `Authorization: Bearer <token>` header.
- [ ] Expose verified claims as `req.user`.
- [ ] Export the guard from the auth module for BusinessModule use.
- [ ] Run auth tests.

### Task 2: Secure Business endpoints

**Files:**
- Modify: `apps/api/src/modules/business/business.module.ts`
- Modify: `apps/api/src/modules/business/business.controller.ts`
- Modify: `apps/api/src/modules/business/business.service.ts`

- [ ] Apply the JWT guard to Business routes that expose or mutate tenant data.
- [ ] Remove body `userId` from upgrade and blueprint request contracts.
- [ ] Pass `req.user.sub` into membership authorization.
- [ ] Add a `/businesses/me` route for authenticated business discovery instead of trusting `/user/:userId`.
- [ ] Keep the existing membership check as the authorization boundary.

### Task 3: Add authorization regression coverage

**Files:**
- Modify: `apps/api/src/modules/business/business.service.spec.ts`
- Create: `apps/api/src/modules/business/business.controller.spec.ts`

- [ ] Verify an owner can upgrade their own business.
- [ ] Verify a non-member receives `403` and no entitlement is written.
- [ ] Verify request-body `userId` cannot override the authenticated identity.
- [ ] Verify unauthenticated requests are rejected by the guard.

### Task 4: Verify CI and cross-product contract

**Files:**
- Inspect: existing GitHub Actions configuration.

- [ ] Run API unit/regression tests.
- [ ] Run full CI on the resulting commit.
- [ ] Verify MyArea registration token contains the same Business ID created in the transaction.
- [ ] Verify AdForge upgrade uses that same Business ID and upserts the `ADFORGE` entitlement.
- [ ] Verify KhadakX blueprint writes remain attached to that Business ID.
- [ ] Mark Cross-product E2E green only after runtime verification; otherwise report the exact remaining runtime dependency.

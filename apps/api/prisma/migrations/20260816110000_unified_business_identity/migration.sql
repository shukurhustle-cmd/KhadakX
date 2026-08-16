CREATE TABLE IF NOT EXISTS "User" (
  "id" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "password" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "phone" TEXT,
  "role" TEXT NOT NULL DEFAULT 'CUSTOMER',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "phone" TEXT;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "role" TEXT NOT NULL DEFAULT 'CUSTOMER';

CREATE TABLE IF NOT EXISTS "Business" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "industry" TEXT,
  "phone" TEXT,
  "email" TEXT,
  "city" TEXT,
  "state" TEXT,
  "country" TEXT NOT NULL DEFAULT 'India',
  "website" TEXT,
  "logoUrl" TEXT,
  "description" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Business_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "BusinessMembership" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "businessId" TEXT NOT NULL,
  "role" TEXT NOT NULL DEFAULT 'OWNER',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "BusinessMembership_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "BusinessEntitlement" (
  "id" TEXT NOT NULL,
  "businessId" TEXT NOT NULL,
  "module" TEXT NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'ACTIVE',
  "metadata" JSONB,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "BusinessEntitlement_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "BusinessBlueprint" (
  "id" TEXT NOT NULL,
  "businessId" TEXT NOT NULL,
  "source" TEXT NOT NULL DEFAULT 'KHADAKX',
  "version" INTEGER NOT NULL DEFAULT 1,
  "status" TEXT NOT NULL DEFAULT 'DRAFT',
  "payload" JSONB NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "BusinessBlueprint_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX IF NOT EXISTS "Business_slug_key" ON "Business"("slug");
CREATE UNIQUE INDEX IF NOT EXISTS "BusinessMembership_userId_businessId_key" ON "BusinessMembership"("userId", "businessId");
CREATE INDEX IF NOT EXISTS "BusinessMembership_userId_idx" ON "BusinessMembership"("userId");
CREATE INDEX IF NOT EXISTS "BusinessMembership_businessId_idx" ON "BusinessMembership"("businessId");
CREATE UNIQUE INDEX IF NOT EXISTS "BusinessEntitlement_businessId_module_key" ON "BusinessEntitlement"("businessId", "module");
CREATE INDEX IF NOT EXISTS "BusinessEntitlement_businessId_idx" ON "BusinessEntitlement"("businessId");
CREATE INDEX IF NOT EXISTS "BusinessBlueprint_businessId_idx" ON "BusinessBlueprint"("businessId");

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'BusinessMembership_userId_fkey') THEN
    ALTER TABLE "BusinessMembership" ADD CONSTRAINT "BusinessMembership_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'BusinessMembership_businessId_fkey') THEN
    ALTER TABLE "BusinessMembership" ADD CONSTRAINT "BusinessMembership_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'BusinessEntitlement_businessId_fkey') THEN
    ALTER TABLE "BusinessEntitlement" ADD CONSTRAINT "BusinessEntitlement_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'BusinessBlueprint_businessId_fkey') THEN
    ALTER TABLE "BusinessBlueprint" ADD CONSTRAINT "BusinessBlueprint_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;

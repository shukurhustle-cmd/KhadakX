import { BusinessService } from './business.service';

describe('BusinessService authorization', () => {
  const prisma = () => ({
    business: { findUnique: jest.fn().mockResolvedValue({ id: 'business-1' }) },
    businessMembership: { findFirst: jest.fn() },
    businessEntitlement: { upsert: jest.fn().mockResolvedValue({ businessId: 'business-1', module: 'ADFORGE', status: 'ACTIVE' }) },
    businessBlueprint: { findFirst: jest.fn(), create: jest.fn() },
  }) as any;

  it('allows upgrade when the authenticated user is a business member', async () => {
    const db = prisma();
    db.businessMembership.findFirst.mockResolvedValue({ businessId: 'business-1', userId: 'user-1', role: 'OWNER' });
    const service = new BusinessService(db);

    await expect(service.upgradeForUser('business-1', 'user-1', 'ADFORGE')).resolves.toMatchObject({ module: 'ADFORGE' });
    expect(db.businessEntitlement.upsert).toHaveBeenCalled();
  });

  it('rejects upgrade when the user is not a business member', async () => {
    const db = prisma();
    db.businessMembership.findFirst.mockResolvedValue(null);
    const service = new BusinessService(db);

    await expect(service.upgradeForUser('business-1', 'user-1', 'ADFORGE')).rejects.toThrow();
    expect(db.businessEntitlement.upsert).not.toHaveBeenCalled();
  });
});

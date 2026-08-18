import { BusinessService } from './business.service';

describe('BusinessService authorization', () => {
  it('must reject upgrade when the user is not a business member', async () => {
    const prisma = {
      business: { findUnique: jest.fn() },
      businessMembership: { findFirst: jest.fn().mockResolvedValue(null) },
      businessEntitlement: { upsert: jest.fn() },
      businessBlueprint: { findFirst: jest.fn(), create: jest.fn() },
    } as any;
    const service = new BusinessService(prisma);

    await expect(service.upgradeForUser('business-1', 'user-1', 'ADFORGE')).rejects.toThrow();
    expect(prisma.businessEntitlement.upsert).not.toHaveBeenCalled();
  });
});

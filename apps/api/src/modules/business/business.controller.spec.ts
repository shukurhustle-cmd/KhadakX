import { BusinessController } from './business.controller';

describe('BusinessController authentication boundary', () => {
  it('uses the authenticated JWT subject for upgrade', async () => {
    const businesses = {
      upgradeForUser: jest.fn().mockResolvedValue({ businessId: 'business-1', module: 'ADFORGE' }),
    } as any;
    const controller = new BusinessController(businesses);

    await controller.upgrade('business-1', { module: 'ADFORGE' }, { user: { sub: 'verified-user' } });

    expect(businesses.upgradeForUser).toHaveBeenCalledWith('business-1', 'verified-user', 'ADFORGE');
  });

  it('does not accept a body userId as an authentication identity', async () => {
    const businesses = {
      upgradeForUser: jest.fn().mockResolvedValue({}),
    } as any;
    const controller = new BusinessController(businesses);

    await controller.upgrade(
      'business-1',
      { module: 'ADFORGE', userId: 'attacker-supplied-user' } as any,
      { user: { sub: 'verified-user' } },
    );

    expect(businesses.upgradeForUser).toHaveBeenCalledWith('business-1', 'verified-user', 'ADFORGE');
  });
});

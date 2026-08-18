import { AdforgeIntegrationService } from './adforge/adforge.integration.service';
import { MyareaIntegrationService } from './myarea/myarea.integration.service';

describe('Cross-product E2E contract: MyArea -> KhadakX -> AdForge', () => {
  const businessId = 'business-e2e-001';
  const prisma = {
    business: {
      findUnique: jest.fn(),
    },
  } as any;

  const adforge = new AdforgeIntegrationService(prisma);
  const myarea = new MyareaIntegrationService(adforge);

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.ADFORGE_WEBHOOK_URL = 'https://adforge.test/webhook';
    process.env.ADFORGE_WEBHOOK_SECRET = 'e2e-secret';
    global.fetch = jest.fn().mockResolvedValue({ ok: true, status: 202 }) as any;

    prisma.business.findUnique.mockResolvedValue({
      id: businessId,
      name: 'E2E Demo Business',
      description: 'Cross-product E2E business',
      industry: 'restaurant',
      website: 'https://example.test',
      phone: '+919999999999',
      city: 'Hyderabad',
      country: 'IN',
      entitlements: [
        { module: 'MYAREA', status: 'ACTIVE' },
        { module: 'KHADAKX', status: 'ACTIVE' },
        { module: 'ADFORGE', status: 'ACTIVE' },
      ],
      blueprints: [{ version: 3, payload: { brand: { name: 'E2E Demo Business' } } }],
    });
  });

  afterEach(() => {
    delete process.env.ADFORGE_WEBHOOK_URL;
    delete process.env.ADFORGE_WEBHOOK_SECRET;
  });

  it('preserves one Business ID from MyArea vendor context through AdForge delivery', async () => {
    const context = myarea.vendorToBusinessContext({
      vendorId: businessId,
      businessName: 'E2E Demo Business',
      vertical: 'restaurant',
      websiteUrl: 'https://example.test',
    });

    expect(context.businessId).toBe(businessId);
    expect(context.source).toBe('khadakx');

    const event = myarea.listingToEvent({
      listingId: 'listing-e2e-001',
      vendorId: businessId,
      title: 'Signature Dish',
      price: 299,
    });

    expect(event.businessId).toBe(businessId);
    expect(myarea.validateMappedEvent(event).valid).toBe(true);

    const result = await adforge.launchFromBusiness(businessId, 'E2E campaign launch');

    expect(result.accepted).toBe(true);
    expect(result.event.businessId).toBe(businessId);
    expect(result.event.payload.context).toMatchObject({ businessId, source: 'khadakx' });
    expect(result.event.payload.blueprintVersion).toBe(3);

    const [url, request] = (global.fetch as jest.Mock).mock.calls[0];
    expect(url).toBe('https://adforge.test/webhook');
    expect(request.headers['x-khadakx-event-id']).toBe(result.event.eventId);
    expect(request.headers['x-khadakx-signature']).toMatch(/^sha256=[a-f0-9]{64}$/);
    expect(JSON.parse(request.body).businessId).toBe(businessId);

    // The cross-product launch reads one canonical Business record by ID;
    // no secondary business creation path exists in this integration flow.
    expect(prisma.business.findUnique).toHaveBeenCalledTimes(1);
    expect(prisma.business.findUnique).toHaveBeenCalledWith(expect.objectContaining({ where: { id: businessId } }));
  });
});

import { createHmac } from 'node:crypto';
import { createServer, IncomingMessage, ServerResponse } from 'node:http';
import { AddressInfo } from 'node:net';
import { AdforgeIntegrationService } from './adforge.integration.service';

describe('AdForge live delivery E2E', () => {
  const secret = 'khadakx-e2e-test-secret';
  let server: ReturnType<typeof createServer>;
  let webhookUrl: string;
  let received: { event: any; validSignature: boolean; businessId: string }[] = [];

  beforeAll(async () => {
    received = [];
    server = createServer((req: IncomingMessage, res: ServerResponse) => {
      if (req.method !== 'POST' || req.url !== '/adforge/webhook') {
        res.statusCode = 404;
        res.end();
        return;
      }

      const chunks: Buffer[] = [];
      req.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
      req.on('end', () => {
        const body = Buffer.concat(chunks).toString('utf8');
        const signature = req.headers['x-khadakx-signature'];
        const expected = `sha256=${createHmac('sha256', secret).update(body).digest('hex')}`;
        const validSignature = signature === expected;
        const event = JSON.parse(body);
        received.push({ event, validSignature, businessId: event.businessId });

        res.statusCode = validSignature ? 202 : 401;
        res.setHeader('content-type', 'application/json');
        res.end(JSON.stringify({ accepted: validSignature }));
      });
    });

    await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve));
    const address = server.address() as AddressInfo;
    webhookUrl = `http://127.0.0.1:${address.port}/adforge/webhook`;
  });

  afterAll(async () => {
    await new Promise<void>((resolve, reject) => server.close((error) => (error ? reject(error) : resolve())));
  });

  it('delivers a signed campaign event over real HTTP with one Business ID', async () => {
    process.env.ADFORGE_WEBHOOK_URL = webhookUrl;
    process.env.ADFORGE_WEBHOOK_SECRET = secret;

    const businessId = 'business-e2e-001';
    const prisma = {
      business: {
        findUnique: jest.fn().mockResolvedValue({
          id: businessId,
          name: 'E2E Test Business',
          industry: 'restaurant',
          description: 'Runtime E2E business',
          website: 'https://example.test',
          phone: '+910000000000',
          city: 'Hyderabad',
          country: 'India',
          entitlements: [
            { module: 'myarea', status: 'ACTIVE' },
            { module: 'adforge', status: 'ACTIVE' },
          ],
          blueprints: [{ version: 1, payload: { source: 'e2e' } }],
        }),
      },
    } as any;

    const service = new AdforgeIntegrationService(prisma);
    const result = await service.launchFromBusiness(businessId, 'E2E runtime verification');

    expect(result.delivery.delivered).toBe(true);
    expect(result.delivery.statusCode).toBe(202);
    expect(received).toHaveLength(1);
    expect(received[0].validSignature).toBe(true);
    expect(received[0].businessId).toBe(businessId);
    expect(received[0].event.payload.context.businessId).toBe(businessId);
    expect(received[0].event.payload.blueprintVersion).toBe(1);
  });
});

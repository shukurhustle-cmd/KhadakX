import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

export const PRODUCT_MODULES = ['MYAREA', 'KHADAKX', 'ADFORGE'] as const;

@Injectable()
export class BusinessService {
  constructor(private readonly prisma: PrismaService) {}

  async getForUser(userId: string) {
    const memberships = await this.prisma.businessMembership.findMany({
      where: { userId },
      include: { business: { include: { entitlements: true, blueprints: { orderBy: { version: 'desc' }, take: 1 } } } },
    });
    return memberships.map(({ business, role }) => ({ ...business, membershipRole: role }));
  }

  async getBusiness(businessId: string) {
    const business = await this.prisma.business.findUnique({
      where: { id: businessId },
      include: { entitlements: true, blueprints: { orderBy: { version: 'desc' }, take: 1 } },
    });
    if (!business) throw new NotFoundException('Business not found');
    return business;
  }

  async upgrade(businessId: string, module: string) {
    const normalized = module.toUpperCase();
    if (!PRODUCT_MODULES.includes(normalized as (typeof PRODUCT_MODULES)[number])) {
      throw new Error(`Unsupported module: ${module}`);
    }
    await this.getBusiness(businessId);
    return this.prisma.businessEntitlement.upsert({
      where: { businessId_module: { businessId, module: normalized } },
      create: { businessId, module: normalized, status: 'ACTIVE' },
      update: { status: 'ACTIVE' },
    });
  }

  async saveBlueprint(businessId: string, payload: Record<string, unknown>, source = 'KHADAKX') {
    await this.getBusiness(businessId);
    const latest = await this.prisma.businessBlueprint.findFirst({
      where: { businessId },
      orderBy: { version: 'desc' },
      select: { version: true },
    });
    const version = (latest?.version || 0) + 1;
    return this.prisma.businessBlueprint.create({
      data: { businessId, payload, source, version, status: 'READY' },
    });
  }
}

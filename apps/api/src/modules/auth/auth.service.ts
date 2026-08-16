import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  async login(body: { email: string; password: string }) {
    const email = String(body.email || '').trim().toLowerCase();
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: { memberships: { include: { business: { include: { entitlements: true } } } } },
    });

    if (!user || !(await bcrypt.compare(body.password || '', user.password))) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const business = user.memberships[0]?.business || null;
    const token = this.jwtService.sign({ sub: user.id, email: user.email, role: user.role, businessId: business?.id });

    return {
      access_token: token,
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
      business,
    };
  }

  async register(body: {
    email: string;
    password: string;
    name: string;
    phone?: string;
    businessName: string;
    industry?: string;
    city?: string;
    state?: string;
    product?: 'MYAREA' | 'KHADAKX' | 'ADFORGE';
  }) {
    const email = String(body.email || '').trim().toLowerCase();
    if (!email || !body.password || !body.name || !body.businessName) {
      throw new BadRequestException('email, password, name and businessName are required');
    }

    const existing = await this.prisma.user.findUnique({ where: { email } });
    if (existing) throw new BadRequestException('An account already exists for this email');

    const slugBase = body.businessName.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'business';
    const slug = `${slugBase}-${Date.now().toString(36)}`;
    const product = body.product || 'MYAREA';
    const password = await bcrypt.hash(body.password, 12);

    const result = await this.prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: { email, password, name: body.name, phone: body.phone },
      });
      const business = await tx.business.create({
        data: {
          name: body.businessName,
          slug,
          industry: body.industry,
          phone: body.phone,
          email,
          city: body.city,
          state: body.state,
          memberships: { create: { userId: user.id, role: 'OWNER' } },
          entitlements: { create: { module: product, status: 'ACTIVE' } },
        },
        include: { entitlements: true },
      });
      return { user, business };
    });

    const token = this.jwtService.sign({
      sub: result.user.id,
      email: result.user.email,
      role: result.user.role,
      businessId: result.business.id,
    });

    return {
      message: 'Registration successful',
      access_token: token,
      user: { id: result.user.id, email: result.user.email, name: result.user.name, role: result.user.role },
      business: result.business,
    };
  }
}

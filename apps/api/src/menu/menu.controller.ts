import { Controller, Get, Param } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Controller('menu')
export class MenuController {
  private prisma = new PrismaClient();

  @Get(':restaurantSlug')
  async getMenu(@Param('restaurantSlug') slug: string) {
    return this.prisma.menuItem.findMany({
      where: { restaurant: { slug } },
    });
  }
}
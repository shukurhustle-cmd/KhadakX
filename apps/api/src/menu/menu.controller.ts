import { Controller, Get, Param } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Controller('menu')
export class MenuController {
  private prisma = new PrismaClient();

  @Get(':restaurantSlug')
  async getMenu(@Param('restaurantSlug') slug: string) {
    // Return sample menu items
    return [
      { id: '1', name: 'Butter Chicken', price: 450, category: 'Main Course' },
      { id: '2', name: 'Paneer Tikka', price: 350, category: 'Starters' },
      { id: '3', name: 'Garlic Naan', price: 80, category: 'Breads' }
    ];
  }
}
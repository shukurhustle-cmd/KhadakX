import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Controller('orders')
export class OrdersController {
  private prisma = new PrismaClient();

  @Post()
  async createOrder(@Body() body: { tableId: string; items: any[] }) {
    // TODO: Calculate total, create order
    return this.prisma.order.create({
      data: {
        tableId: body.tableId,
        total: 0, // Calculate from items
        status: 'PENDING',
        items: {
          create: body.items.map(item => ({
            menuItemId: item.menuItemId,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
      include: { items: true },
    });
  }

  @Get('kitchen')
  async getKitchenOrders() {
    return this.prisma.order.findMany({
      where: { status: { in: ['PENDING', 'PREPARING'] } },
      include: { items: { include: { menuItem: true } } },
      orderBy: { createdAt: 'asc' },
    });
  }
}
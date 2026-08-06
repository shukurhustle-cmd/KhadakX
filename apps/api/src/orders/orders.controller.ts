import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Controller('orders')
export class OrdersController {
  private prisma = new PrismaClient();

  @Post()
  async createOrder(@Body() body: { tableId: string; items: any[] }) {
    // Simple order creation - you can expand this later
    return {
      message: 'Order created successfully',
      order: {
        id: 'temp-id',
        tableId: body.tableId,
        items: body.items,
        status: 'PENDING'
      }
    };
  }

  @Get('kitchen')
  async getKitchenOrders() {
    // Return sample orders for now
    return [
      { id: '1', tableId: '1', items: ['Item 1', 'Item 2'], status: 'PREPARING' },
      { id: '2', tableId: '2', items: ['Item 3'], status: 'PENDING' }
    ];
  }
}
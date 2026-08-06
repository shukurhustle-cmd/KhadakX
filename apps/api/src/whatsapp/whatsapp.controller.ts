import { Controller, Post, Body, Get, Query } from '@nestjs/common';

@Controller('whatsapp')
export class WhatsAppController {
  @Get('webhook')
  verifyWebhook(@Query() query: any) {
    if (query['hub.verify_token'] === process.env.WHATSAPP_VERIFY_TOKEN) {
      return query['hub.challenge'];
    }
    return 'Error';
  }

  @Post('webhook')
  async handleMessage(@Body() body: any) {
    const entry = body.entry?.[0];
    const changes = entry?.changes?.[0];
    const message = changes?.value?.messages?.[0];

    if (message) {
      console.log('WhatsApp message received:', message);
    }

    return { status: 'ok' };
  }
}
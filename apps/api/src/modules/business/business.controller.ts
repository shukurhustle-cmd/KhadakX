import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { BusinessService } from './business.service';

@Controller('businesses')
export class BusinessController {
  constructor(private readonly businesses: BusinessService) {}

  @Get(':id')
  getBusiness(@Param('id') id: string) {
    return this.businesses.getBusiness(id);
  }

  @Get('user/:userId')
  getForUser(@Param('userId') userId: string) {
    return this.businesses.getForUser(userId);
  }

  @Post(':id/upgrade')
  upgrade(@Param('id') id: string, @Body() body: { module: string }) {
    return this.businesses.upgrade(id, body.module);
  }

  @Post(':id/blueprint')
  saveBlueprint(
    @Param('id') id: string,
    @Body() body: { payload: Record<string, unknown>; source?: string },
  ) {
    return this.businesses.saveBlueprint(id, body.payload, body.source || 'KHADAKX');
  }
}

import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common';
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
  upgrade(@Param('id') id: string, @Body() body: { module: string; userId: string }) {
    return this.businesses.upgradeForUser(id, body.userId, body.module);
  }

  @Post(':id/blueprint')
  saveBlueprint(
    @Param('id') id: string,
    @Body() body: { payload: Record<string, unknown>; source?: string; userId: string },
  ) {
    return this.businesses.saveBlueprintForUser(id, body.userId, body.payload, body.source || 'KHADAKX');
  }
}

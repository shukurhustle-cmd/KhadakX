import { Body, Controller, ForbiddenException, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { AuthenticatedUser, JwtAuthGuard } from '../auth/jwt-auth.guard';
import { BusinessService } from './business.service';

interface AuthenticatedRequest {
  user: AuthenticatedUser;
}

@Controller('businesses')
@UseGuards(JwtAuthGuard)
export class BusinessController {
  constructor(private readonly businesses: BusinessService) {}

  @Get('me')
  getMine(@Req() req: AuthenticatedRequest) {
    return this.businesses.getForUser(req.user.sub);
  }

  @Get(':id')
  async getBusiness(@Param('id') id: string, @Req() req: AuthenticatedRequest) {
    await this.businesses.assertMemberForUser(id, req.user.sub);
    return this.businesses.getBusiness(id);
  }

  /**
   * Kept for compatibility with older clients, but the path user ID must match
   * the authenticated JWT identity. New clients should use /businesses/me.
   */
  @Get('user/:userId')
  getForUser(@Param('userId') userId: string, @Req() req: AuthenticatedRequest) {
    if (userId !== req.user.sub) throw new ForbiddenException('User identity does not match token');
    return this.businesses.getForUser(req.user.sub);
  }

  @Post(':id/upgrade')
  upgrade(@Param('id') id: string, @Body() body: { module: string }, @Req() req: AuthenticatedRequest) {
    return this.businesses.upgradeForUser(id, req.user.sub, body.module);
  }

  @Post(':id/blueprint')
  saveBlueprint(
    @Param('id') id: string,
    @Body() body: { payload: Record<string, unknown>; source?: string },
    @Req() req: AuthenticatedRequest,
  ) {
    return this.businesses.saveBlueprintForUser(id, req.user.sub, body.payload, body.source || 'KHADAKX');
  }
}

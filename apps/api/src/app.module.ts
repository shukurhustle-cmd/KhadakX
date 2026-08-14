import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { AdforgeIntegrationModule } from './integrations/adforge/adforge.integration.module';

@Module({
  imports: [AuthModule, AdforgeIntegrationModule],
})
export class AppModule {}

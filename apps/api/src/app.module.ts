import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { AdforgeIntegrationModule } from './integrations/adforge/adforge.integration.module';
import { MyareaIntegrationModule } from './integrations/myarea/myarea.integration.module';
import { HealthModule } from './health/health.module';

@Module({
  imports: [AuthModule, AdforgeIntegrationModule, MyareaIntegrationModule, HealthModule],
})
export class AppModule {}

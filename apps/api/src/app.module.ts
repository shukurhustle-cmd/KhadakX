import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { BusinessModule } from './modules/business/business.module';
import { PrismaModule } from './prisma/prisma.module';
import { AdforgeIntegrationModule } from './integrations/adforge/adforge.integration.module';
import { MyareaIntegrationModule } from './integrations/myarea/myarea.integration.module';
import { HealthModule } from './health/health.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    BusinessModule,
    AdforgeIntegrationModule,
    MyareaIntegrationModule,
    HealthModule,
  ],
})
export class AppModule {}

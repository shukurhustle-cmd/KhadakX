import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { AdforgeIntegrationModule } from './integrations/adforge/adforge.integration.module';
import { MyareaIntegrationModule } from './integrations/myarea/myarea.integration.module';

@Module({
  imports: [AuthModule, AdforgeIntegrationModule, MyareaIntegrationModule],
})
export class AppModule {}

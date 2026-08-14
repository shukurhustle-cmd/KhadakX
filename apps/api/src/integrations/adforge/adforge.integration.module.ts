import { Module } from '@nestjs/common';
import { AdforgeIntegrationController } from './adforge.integration.controller';
import { AdforgeIntegrationService } from './adforge.integration.service';

@Module({
  controllers: [AdforgeIntegrationController],
  providers: [AdforgeIntegrationService],
  exports: [AdforgeIntegrationService],
})
export class AdforgeIntegrationModule {}

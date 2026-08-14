import { Module } from '@nestjs/common';
import { AdforgeIntegrationModule } from '../adforge/adforge.integration.module';
import { MyareaIntegrationController } from './myarea.integration.controller';
import { MyareaIntegrationService } from './myarea.integration.service';

@Module({
  imports: [AdforgeIntegrationModule],
  controllers: [MyareaIntegrationController],
  providers: [MyareaIntegrationService],
  exports: [MyareaIntegrationService],
})
export class MyareaIntegrationModule {}

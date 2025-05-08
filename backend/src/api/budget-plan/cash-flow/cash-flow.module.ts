import { Module } from '@nestjs/common';
import { CashFlowService } from './cash-flow.service';
import { CashFlowController } from './cash-flow.controller';

@Module({
  providers: [CashFlowService],
  controllers: [CashFlowController],
})
export class CashFlowModule {}

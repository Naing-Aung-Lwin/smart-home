import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Budget, BudgetSchema } from 'src/schemas/budget-plan/budget.schema';
import { BudgetService } from './budget.service';
import { BudgetController } from './budget.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Budget.name, schema: BudgetSchema }]),
  ],
  providers: [BudgetService],
  controllers: [BudgetController],
})
export class BudgetModule {}

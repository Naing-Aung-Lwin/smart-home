import { Module } from '@nestjs/common';
import { SavingService } from './saving.service';
import { SavingController } from './saving.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Saving, SavingSchema } from 'src/schemas/budget-plan/saving.schema';
import { Budget, BudgetSchema } from 'src/schemas/budget-plan/budget.schema';
import { BudgetService } from '../budget/budget.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Saving.name,
        schema: SavingSchema,
      },
      {
        name: Budget.name,
        schema: BudgetSchema,
      },
    ]),
  ],
  providers: [SavingService, BudgetService],
  controllers: [SavingController],
})
export class SavingModule {}

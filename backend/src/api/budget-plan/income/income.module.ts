import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Income, IncomeSchema } from 'src/schemas/budget-plan/income.schema';
import {
  IncomeSource,
  IncomeSourceSchema,
} from 'src/schemas/budget-plan/income-source.schema';
import { IncomeService } from './income.service';
import { IncomeController } from './income.controller';
import { IncomeSourceService } from 'src/api/budget-plan/income-source/income-source.service';
import { BudgetService } from '../budget/budget.service';
import { Budget, BudgetSchema } from 'src/schemas/budget-plan/budget.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Income.name, schema: IncomeSchema },
      {
        name: IncomeSource.name,
        schema: IncomeSourceSchema,
      },
      { name: Budget.name, schema: BudgetSchema },
    ]),
  ],
  providers: [IncomeService, IncomeSourceService, BudgetService],
  controllers: [IncomeController],
})
export class IncomeModule {}

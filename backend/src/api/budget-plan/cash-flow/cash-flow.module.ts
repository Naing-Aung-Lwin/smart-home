import { Module } from '@nestjs/common';
import { CashFlowService } from './cash-flow.service';
import { CashFlowController } from './cash-flow.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { CashFlowSchema } from 'src/schemas/budget-plan/cash-flow.schema';
import { IncomeSourceService } from '../income-source/income-source.service';
import { ExpenseCategoryService } from '../expense-category/expense-category.service';
import { BudgetService } from '../budget/budget.service';
import { IncomeSourceSchema } from 'src/schemas/budget-plan/income-source.schema';
import { ExpenseCategorySchema } from 'src/schemas/budget-plan/expense-category.schema';
import { BudgetSchema } from 'src/schemas/budget-plan/budget.schema';
import { SavingService } from '../saving/saving.service';
import { SavingSchema } from 'src/schemas/budget-plan/saving.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'CashFlow', schema: CashFlowSchema },
      { name: 'IncomeSource', schema: IncomeSourceSchema },
      { name: 'ExpenseCategory', schema: ExpenseCategorySchema },
      { name: 'Budget', schema: BudgetSchema },
      { name: 'Saving', schema: SavingSchema },
    ]),
  ],
  providers: [
    CashFlowService,
    IncomeSourceService,
    ExpenseCategoryService,
    BudgetService,
    SavingService,
  ],
  controllers: [CashFlowController],
})
export class CashFlowModule {}

import { Module } from '@nestjs/common';
import { ExpenseService } from './expense.service';
import { ExpenseController } from './expense.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Expense, ExpenseSchema } from 'src/schemas/budget-plan/expense.schema';
import { Budget, BudgetSchema } from 'src/schemas/budget-plan/budget.schema';
import {
  ExpenseCategory,
  ExpenseCategorySchema,
} from 'src/schemas/budget-plan/expense-category.schema';
import { ExpenseCategoryService } from '../expense-category/expense-category.service';
import { BudgetService } from '../budget/budget.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Expense.name, schema: ExpenseSchema },
      { name: Budget.name, schema: BudgetSchema },
      { name: ExpenseCategory.name, schema: ExpenseCategorySchema },
    ]),
  ],
  providers: [ExpenseService, ExpenseCategoryService, BudgetService],
  controllers: [ExpenseController],
})
export class ExpenseModule {}

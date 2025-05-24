import { NotFoundException } from '@nestjs/common';
import { BudgetService } from '../../budget/budget.service';
import { CreateBudgetDto } from 'src/dtos/budget-plan/budget.dto';
import { Budget } from 'src/schemas/budget-plan/budget.schema';
import { CashFlow } from 'src/schemas/budget-plan/cash-flow.schema';

export async function handleBudget(
  date: string,
  budgetSvc: BudgetService,
): Promise<Budget> {
  const [year, month] = date.split('-');
  if (!month || !year) {
    throw new NotFoundException('Month or year not found');
  }

  const budgetMonth: CreateBudgetDto = { month: `${year}-${month}` };
  const budget = await budgetSvc.create(budgetMonth);
  if (!budget) throw new NotFoundException('Budget not found');
  return budget;
}

export async function updateBudget(
  budgetId: string,
  budgetSvc: BudgetService,
  totalIncome: number,
  totalExpense: number,
  month: string,
): Promise<void> {
  await budgetSvc.update(budgetId, {
    totalIncome,
    totalExpense,
    month,
  });
}

export function calculateUpdatedBudget(
  budget: Budget,
  currentAmount: number,
  newAmount: number | undefined,
  categoryType: string,
): { totalIncome: number; totalExpense: number } {
  let totalIncome = budget.totalIncome;
  let totalExpense = budget.totalExpense;

  if (newAmount !== undefined) {
    if (categoryType === 'ExpenseCategory') {
      totalExpense = budget.totalExpense - currentAmount + newAmount;
    } else {
      totalIncome = budget.totalIncome - currentAmount + newAmount;
    }
  }

  return { totalIncome, totalExpense };
}

export function calculateBudgetAfterDelete(budget: Budget, current: CashFlow) {
  let totalIncome = budget.totalIncome;
  let totalExpense = budget.totalExpense;
  if (current.categoryType === 'ExpenseCategory') {
    totalExpense = budget.totalExpense - current.amount;
  } else {
    totalIncome = budget.totalIncome - current.amount;
  }
  return { totalIncome, totalExpense };
}

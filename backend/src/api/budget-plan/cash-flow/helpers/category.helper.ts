import { NotFoundException } from '@nestjs/common';
import { IncomeSourceService } from 'src/api/budget-plan/income-source/income-source.service';
import { ExpenseCategoryService } from 'src/api/budget-plan/expense-category/expense-category.service';
import { IncomeSource } from 'src/schemas/budget-plan/income-source.schema';
import { ExpenseCategory } from 'src/schemas/budget-plan/expense-category.schema';

export async function handleCategory(
  categoryType: string,
  categoryName: string,
  incomeSourceSvc: IncomeSourceService,
  expenseCategorySvc: ExpenseCategoryService,
): Promise<IncomeSource | ExpenseCategory> {
  if (categoryType === 'IncomeSource') {
    return await incomeSourceSvc.create({ name: categoryName });
  } else if (categoryType === 'ExpenseCategory') {
    return await expenseCategorySvc.create({ name: categoryName });
  } else {
    throw new NotFoundException('Category not found');
  }
}

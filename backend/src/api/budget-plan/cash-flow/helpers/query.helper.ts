import { FilterQuery, Types } from 'mongoose';
import { CashFlow } from 'src/schemas/budget-plan/cash-flow.schema';
import { FilterCashFlowDto } from 'src/dtos/budget-plan/cash-flow.dto';

export function buildCashFlowQuery(
  filter: FilterCashFlowDto,
): FilterQuery<CashFlow> {
  const query: FilterQuery<CashFlow> = {};

  if (filter.categoryId) {
    query.categoryId = new Types.ObjectId(filter.categoryId);
  }

  if (filter.categoryType) {
    query.categoryType = filter.categoryType;
  }

  if (filter.budgetId) {
    query.budgetId = new Types.ObjectId(filter.budgetId);
  }

  if (filter.minAmount !== undefined || filter.maxAmount !== undefined) {
    const amount: { $gte?: number; $lte?: number } = {};
    if (filter.minAmount !== undefined) {
      amount.$gte = filter.minAmount;
    }
    if (filter.maxAmount !== undefined) {
      amount.$lte = filter.maxAmount;
    }
    query.amount = amount;
  }

  if (filter.startDate || filter.endDate) {
    const date: { $gte?: string; $lte?: string } = {};
    if (filter.startDate) {
      date.$gte = filter.startDate;
    }
    if (filter.endDate) {
      date.$lte = filter.endDate;
    }
    query.date = date;
  }

  return query;
}

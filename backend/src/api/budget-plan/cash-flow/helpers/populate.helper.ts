import { Model } from 'mongoose';
import { CashFlow } from 'src/schemas/budget-plan/cash-flow.schema';

export async function populateCashFlows(
  cashFlows: CashFlow[],
  cashFlowModel: Model<CashFlow>,
): Promise<CashFlow[]> {
  return Promise.all(
    cashFlows.map(async (tx) => {
      return cashFlowModel.populate(tx, {
        path: 'categoryId',
        model: tx.categoryType,
      });
    }),
  );
}

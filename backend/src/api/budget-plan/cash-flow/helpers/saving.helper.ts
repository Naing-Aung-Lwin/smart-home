import { CreateCashFlowDto } from 'src/dtos/budget-plan/cash-flow.dto';
import { SavingService } from '../../saving/saving.service';

export async function handleSaving(
  dto: CreateCashFlowDto,
  savingSvc: SavingService,
  cashFlowId: string,
) {
  if (dto?.categoryType !== 'IncomeSource') {
    return null;
  }
  if (dto?.incomeType !== 'saving') {
    return null;
  }
  if (dto?.savingType === 'normal') {
    const savingAmount = dto.savingAmount || 0;
    if (savingAmount <= 0 || savingAmount > dto.amount) {
      throw new Error('Invalid saving amount');
    }
    const saving = await savingSvc.create({
      amount: savingAmount,
      date: dto.date,
      description: `Saving from ${dto.category}`,
      incomeId: cashFlowId,
    });
    return saving;
  }
  if (dto?.savingType === 'percentage') {
    const savingPercentage = dto.savingPercentage || 0;
    if (savingPercentage <= 0 || savingPercentage > 100) {
      throw new Error('Invalid saving percentage');
    }
    const savingAmount = (dto.amount * savingPercentage) / 100;
    const saving = await savingSvc.create({
      amount: savingAmount,
      date: dto.date,
      description: `Saving from ${dto.category}`,
      incomeId: cashFlowId,
    });
    return saving;
  }
  return null;
}

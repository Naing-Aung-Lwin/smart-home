import { CreateCashFlowDto } from 'src/dtos/budget-plan/cash-flow.dto';
import { SavingService } from '../../saving/saving.service';
import { BadRequestException } from '@nestjs/common';
import { CashFlow } from 'src/schemas/budget-plan/cash-flow.schema';
import { UpdateSavingDto } from 'src/dtos/budget-plan/saving.dto';
import { Saving } from 'src/schemas/budget-plan/saving.schema';

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
      throw new BadRequestException('Invalid saving amount');
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
      throw new BadRequestException('Invalid saving percentage');
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

export async function handleUpdateSaving(
  dto: CreateCashFlowDto,
  currentCashFlow: CashFlow,
  savingSvc: SavingService,
  cashFlowId: string,
  saving: Saving | null,
) {
  if (currentCashFlow.savingId && dto.incomeType === 'normal') {
    const currentSaving = await savingSvc.findById(
      String(currentCashFlow.savingId),
    );
    await savingSvc.delete(String(currentCashFlow.savingId));
    return currentCashFlow.amount + currentSaving.amount;
  }
  if (!dto.savingAmount && !dto.savingPercentage) {
    return currentCashFlow.amount;
  }
  let savingId = saving?._id as string;
  if (!savingId) {
    const newSaving = await savingSvc.create({
      amount: dto.savingAmount || 0,
      date: dto.date || currentCashFlow.date,
      incomeId: cashFlowId,
    });
    savingId = newSaving._id as string;
  }
  const amount = dto.amount || currentCashFlow.amount;
  if (dto?.savingType === 'normal') {
    const savingAmount = dto.savingAmount || 0;
    if (savingAmount <= 0 || savingAmount > amount) {
      throw new BadRequestException('Invalid saving amount');
    }
    const payload: UpdateSavingDto = {
      amount: savingAmount,
      date: dto.date || currentCashFlow.date,
      incomeId: cashFlowId,
    };
    if (dto.category) {
      payload.description = `Saving from ${dto.category}`;
    }
    const saving = await savingSvc.update(savingId, payload);
    return amount - saving.amount;
  }
  if (dto?.savingType === 'percentage') {
    const savingPercentage = dto.savingPercentage || 0;
    if (savingPercentage <= 0 || savingPercentage > 100) {
      throw new BadRequestException('Invalid saving percentage');
    }
    const savingAmount = (amount * savingPercentage) / 100;
    const payload: UpdateSavingDto = {
      amount: savingAmount,
      date: dto.date || currentCashFlow.date,
      incomeId: cashFlowId,
    };
    if (dto.category) {
      payload.description = `Saving from ${dto.category}`;
    }
    const saving = await savingSvc.update(savingId, payload);
    return amount - saving.amount;
  }
  return currentCashFlow.amount;
}

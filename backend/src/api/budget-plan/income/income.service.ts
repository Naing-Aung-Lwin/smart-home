import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Income } from 'src/schemas/budget-plan/income.schema';
import {
  CreateIncomeDto,
  UpdateIncomeDto,
} from 'src/dtos/budget-plan/income.dto';
import { IncomeSourceService } from 'src/api/budget-plan/income-source/income-source.service';
import { BudgetService } from '../budget/budget.service';

@Injectable()
export class IncomeService {
  constructor(
    @InjectModel(Income.name) private incomeModel: Model<Income>,
    private incomeSourceSvc: IncomeSourceService,
    private budgetSvc: BudgetService,
  ) {}

  async create(dto: CreateIncomeDto): Promise<Income> {
    const source = await this.incomeSourceSvc.create({ name: dto.source });
    const budget = await this.budgetSvc.findById(dto.budgetId);
    if (!budget) throw new NotFoundException('Budget not found');
    const totalIncome = budget.totalIncome + dto.amount;
    await this.budgetSvc.update(budget._id as string, {
      totalIncome,
      month: budget.month,
      totalExpense: budget.totalExpense,
    });
    const created = new this.incomeModel({
      ...dto,
      source: source._id,
    });
    return created.save();
  }

  async findAll(): Promise<Income[]> {
    return this.incomeModel.find().populate('source').exec();
  }

  async findById(id: string): Promise<Income> {
    const income = await this.incomeModel
      .findById(id)
      .populate('source')
      .exec();
    if (!income) throw new NotFoundException('Income not found');
    return income;
  }

  async update(id: string, dto: UpdateIncomeDto): Promise<Income> {
    const source = dto.source
      ? await this.incomeSourceSvc.create({ name: dto.source })
      : null;
    const updateDto = source ? { ...dto, source: source._id } : dto;
    const updated = await this.incomeModel
      .findByIdAndUpdate(id, updateDto, { new: true })
      .exec();
    if (!updated) throw new NotFoundException('Income not found');
    return updated;
  }

  async delete(id: string): Promise<void> {
    const deleted = await this.incomeModel.findByIdAndDelete(id).exec();
    if (!deleted) throw new NotFoundException('Income not found');
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { Saving } from 'src/schemas/budget-plan/saving.schema';
import {
  CreateSavingDto,
  FilterSavingDto,
  UpdateSavingDto,
} from 'src/dtos/budget-plan/saving.dto';
import { Budget } from 'src/schemas/budget-plan/budget.schema';

@Injectable()
export class SavingService {
  constructor(
    @InjectModel(Saving.name) private readonly model: Model<Saving>,
    @InjectModel(Budget.name) private readonly budgetModel: Model<Budget>,
  ) {}

  async create(dto: CreateSavingDto) {
    const saving = new this.model(dto);
    const budgetId = dto?.budgetId;
    if (budgetId) {
      const budget = await this.budgetModel.findById(budgetId).exec();
      if (!budget) throw new NotFoundException('Budget not found');
      const remainAmount =
        budget.totalIncome - budget.totalExpense - budget.totalSaving;
      if (remainAmount < dto.amount) {
        throw new NotFoundException('Not enough money to save');
      }
      budget.totalSaving += dto.amount;
      await budget.save();
    }
    return saving.save();
  }

  findAll(filter: FilterSavingDto) {
    const query: FilterQuery<Saving> = {};
    if (filter.fromDate || filter.toDate) {
      const date: { $gte?: string; $lte?: string } = {};
      if (filter.fromDate) {
        date.$gte = filter.fromDate;
      }
      if (filter.toDate) {
        date.$lte = filter.toDate;
      }
      query.date = date;
    }
    return this.model.find(query).sort({ date: -1 }).exec();
  }

  async findById(id: string) {
    const saving = await this.model.findById(id).exec();
    if (!saving) throw new NotFoundException('Saving not found');
    return saving;
  }

  async update(id: string, dto: UpdateSavingDto) {
    const existing = await this.model.findById(id).exec();
    const payload = { ...existing, ...dto };
    await this.delete(id);
    return this.create(payload);
  }

  async delete(id: string) {
    const saving = await this.model.findById(id).exec();
    const budgetId = saving?.budgetId;
    if (budgetId) {
      const budget = await this.budgetModel.findById(budgetId).exec();
      if (!budget) throw new NotFoundException('Budget not found');
      budget.totalSaving -= saving.amount;
      await budget.save();
    }
    const deleted = await this.model.findByIdAndDelete(id).exec();
    if (!deleted) throw new NotFoundException('Saving not found');
  }
}

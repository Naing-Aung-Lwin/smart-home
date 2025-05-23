import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Budget } from 'src/schemas/budget-plan/budget.schema';
import { Model } from 'mongoose';
import {
  CreateBudgetDto,
  SearchBudgetDto,
  UpdateBudgetDto,
} from 'src/dtos/budget-plan/budget.dto';

@Injectable()
export class BudgetService {
  constructor(@InjectModel(Budget.name) private model: Model<Budget>) {}

  async create(dto: CreateBudgetDto) {
    const existingBudget = await this.model
      .findOne({ month: dto.month })
      .exec();
    if (existingBudget) {
      return existingBudget;
    }
    const budget = new this.model(dto);
    return budget.save();
  }

  findAll(query: SearchBudgetDto) {
    if (query.month) {
      return this.model.find({ month: query.month }).exec();
    }
    return this.model.find().exec();
  }

  async findById(id: string) {
    const budget = await this.model.findById(id).exec();
    if (!budget) throw new NotFoundException('Budget not found');
    return budget;
  }

  async update(id: string, dto: UpdateBudgetDto) {
    const updated = await this.model
      .findByIdAndUpdate(id, dto, { new: true })
      .exec();
    if (!updated) throw new NotFoundException('Budget not found');
    return updated;
  }

  async delete(id: string) {
    const deleted = await this.model.findByIdAndDelete(id).exec();
    if (!deleted) throw new NotFoundException('Budget not found');
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ExpenseCategory } from 'src/schemas/budget-plan/expense-category.schema';
import {
  CreateExpenseCategoryDto,
  UpdateExpenseCategoryDto,
} from 'src/dtos/budget-plan/expense-category.dto';

@Injectable()
export class ExpenseCategoryService {
  constructor(
    @InjectModel(ExpenseCategory.name)
    private model: Model<ExpenseCategory>,
  ) {}

  async create(dto: CreateExpenseCategoryDto): Promise<ExpenseCategory> {
    const existing = await this.model.findOne({ name: dto.name }).exec();
    if (existing) return existing;
    return new this.model(dto).save();
  }

  findAll(): Promise<ExpenseCategory[]> {
    return this.model.find().exec();
  }

  async findOne(id: string): Promise<ExpenseCategory> {
    const category = await this.model.findById(id).exec();
    if (!category) throw new NotFoundException('Category not found');
    return category;
  }

  async update(
    id: string,
    dto: UpdateExpenseCategoryDto,
  ): Promise<ExpenseCategory> {
    const existing = await this.model.findOne({ name: dto.name }).exec();
    if (existing && existing.id !== id)
      throw new NotFoundException('Category already exists');
    const updated = await this.model
      .findByIdAndUpdate(id, dto, { new: true })
      .exec();
    if (!updated) throw new NotFoundException('Category not found');
    return updated;
  }

  async remove(id: string): Promise<void> {
    const deleted = await this.model.findByIdAndDelete(id).exec();
    if (!deleted) throw new NotFoundException('Category not found');
  }
}

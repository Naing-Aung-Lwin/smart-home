import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Expense } from 'src/schemas/budget-plan/expense.schema';
import {
  CreateExpenseDto,
  UpdateExpenseDto,
} from 'src/dtos/budget-plan/expense.dto';
import { ExpenseCategoryService } from '../expense-category/expense-category.service';
import { BudgetService } from '../budget/budget.service';
import { ExpenseCategory } from 'src/schemas/budget-plan/expense-category.schema';

@Injectable()
export class ExpenseService {
  constructor(
    @InjectModel(Expense.name)
    private model: Model<Expense>,
    private categorySvc: ExpenseCategoryService,
    private budgetSvc: BudgetService,
  ) {}

  async create(dto: CreateExpenseDto): Promise<Expense> {
    const category = await this.categorySvc.create({ name: dto.category });
    const budget = await this.budgetSvc.findById(dto.budgetId);
    if (!budget) throw new NotFoundException('Budget not found');
    const totalExpense = budget.totalExpense + dto.amount;
    await this.budgetSvc.update(budget._id as string, {
      totalExpense,
      month: budget.month,
      totalIncome: budget.totalIncome,
    });
    return new this.model({ ...dto, category: category._id }).save();
  }

  findAll(): Promise<Expense[]> {
    return this.model.find().populate('category').exec();
  }

  async findOne(id: string): Promise<Expense> {
    const expense = await this.model.findById(id).populate('category').exec();
    if (!expense) throw new NotFoundException('Expense not found');
    return expense;
  }

  async update(id: string, dto: UpdateExpenseDto): Promise<Expense> {
    const current = await this.findOne(id);

    let category = current.category as unknown as ExpenseCategory;
    if (dto.category) {
      category = await this.categorySvc.create({ name: dto.category });
    }
    const updateDto = category ? { ...dto, category: category._id } : dto;

    const budgetId = dto.budgetId ? dto.budgetId : String(current.budgetId);
    const budget = await this.budgetSvc.findById(budgetId);
    if (!budget) throw new NotFoundException('Budget not found');
    let totalExpense = budget.totalExpense;

    if (dto.amount) {
      totalExpense = budget.totalExpense - current.amount + dto.amount;
    }

    await this.budgetSvc.update(budget._id as string, {
      totalExpense,
      month: budget.month,
      totalIncome: budget.totalIncome,
    });

    const updated = await this.model
      .findByIdAndUpdate(id, updateDto, { new: true })
      .exec();
    if (!updated) throw new NotFoundException('Expense not found');
    return updated;
  }

  async remove(id: string): Promise<Expense> {
    const current = await this.findOne(id);
    const budget = await this.budgetSvc.findById(String(current.budgetId));
    await this.budgetSvc.update(budget._id as string, {
      totalExpense: budget.totalExpense - current.amount,
      month: budget.month,
      totalIncome: budget.totalIncome,
    });

    const deleted = await this.model.findByIdAndDelete(id).exec();
    if (!deleted) throw new NotFoundException('Expense not found');
    return deleted;
  }
}

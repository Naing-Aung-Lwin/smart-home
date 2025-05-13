import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, Types } from 'mongoose';
import { CashFlow } from 'src/schemas/budget-plan/cash-flow.schema';
import {
  CreateCashFlowDto,
  FilterCashFlowDto,
  UpdateCashFlowDto,
} from 'src/dtos/budget-plan/cash-flow.dto';
import { IncomeSourceService } from 'src/api/budget-plan/income-source/income-source.service';
import { BudgetService } from '../budget/budget.service';
import { IncomeSource } from 'src/schemas/budget-plan/income-source.schema';
import { ExpenseCategoryService } from 'src/api/budget-plan/expense-category/expense-category.service';
import { ExpenseCategory } from 'src/schemas/budget-plan/expense-category.schema';

@Injectable()
export class CashFlowService {
  constructor(
    @InjectModel(CashFlow.name) private cashFlowModel: Model<CashFlow>,
    private incomeSourceSvc: IncomeSourceService,
    private expenseCategorySvc: ExpenseCategoryService,
    private budgetSvc: BudgetService,
  ) {}

  async create(dto: CreateCashFlowDto): Promise<CashFlow> {
    let category: IncomeSource | ExpenseCategory | null = null;
    if (dto.categoryType === 'IncomeSource') {
      category = await this.incomeSourceSvc.create({ name: dto.category });
    } else if (dto.categoryType === 'ExpenseCategory') {
      category = await this.expenseCategorySvc.create({ name: dto.category });
    } else {
      throw new NotFoundException('Category not found');
    }
    const budget = await this.budgetSvc.findById(dto.budgetId);
    if (!budget) throw new NotFoundException('Budget not found');
    if (dto.categoryType === 'IncomeSource') {
      const totalIncome = budget.totalIncome + dto.amount;
      await this.budgetSvc.update(budget._id as string, {
        totalIncome,
        month: budget.month,
        totalExpense: budget.totalExpense,
      });
    } else {
      const totalExpense = budget.totalExpense + dto.amount;
      await this.budgetSvc.update(budget._id as string, {
        totalExpense,
        month: budget.month,
        totalIncome: budget.totalIncome,
      });
    }
    const created = new this.cashFlowModel({
      ...dto,
      categoryId: category._id,
    });
    return created.save();
  }

  async findAll(filter: FilterCashFlowDto): Promise<CashFlow[]> {
    const query: FilterQuery<CashFlow> = {};

    if (filter.categoryId) {
      query.categoryId = new Types.ObjectId(filter.categoryId);
    }

    if (filter.categoryType) {
      query.categoryType = filter.categoryType;
    }

    if (filter.budgetId) {
      query.budgetId = filter.budgetId;
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
    const cashFlows = await this.cashFlowModel
      .find(query)
      .sort({ createdAt: -1 })
      .lean();

    const populatedCashFlows = await Promise.all(
      cashFlows.map(async (tx) => {
        return this.cashFlowModel.populate(tx, {
          path: 'categoryId',
          model: tx.categoryType,
        });
      }),
    );

    return populatedCashFlows;
  }

  async findById(id: string): Promise<CashFlow> {
    const income = await this.cashFlowModel.findById(id);
    if (!income) throw new NotFoundException('Income not found');
    const populatedIncome = await this.cashFlowModel.populate(income, {
      path: 'categoryId',
      model: income.categoryType,
    });
    return populatedIncome;
  }

  async update(id: string, dto: UpdateCashFlowDto): Promise<CashFlow> {
    const current = await this.findById(id);

    let category: IncomeSource | ExpenseCategory | null = null;
    const categoryType = dto.categoryType
      ? dto.categoryType
      : current.categoryType;
    if (categoryType === 'IncomeSource' && dto.category) {
      category = await this.incomeSourceSvc.create({ name: dto.category });
    } else if (categoryType === 'ExpenseCategory' && dto.category) {
      category = await this.expenseCategorySvc.create({ name: dto.category });
    }
    const updateDto = category ? { ...dto, categoryId: category._id } : dto;

    const budgetId = dto.budgetId ? dto.budgetId : String(current.budgetId);
    const budget = await this.budgetSvc.findById(budgetId);
    if (!budget) throw new NotFoundException('Budget not found');
    let totalIncome = budget.totalIncome;
    let totalExpense = budget.totalExpense;

    if (dto.amount) {
      if (dto.categoryType === 'ExpenseCategory') {
        totalExpense = budget.totalExpense - current.amount + dto.amount;
      } else {
        totalIncome = budget.totalIncome - current.amount + dto.amount;
      }
    }

    await this.budgetSvc.update(budget._id as string, {
      totalIncome,
      month: budget.month,
      totalExpense,
    });

    const updated = await this.cashFlowModel
      .findByIdAndUpdate(id, updateDto, { new: true })
      .exec();
    if (!updated) throw new NotFoundException('Income not found');
    return updated;
  }

  async delete(id: string): Promise<CashFlow> {
    const current = await this.findById(id);
    const budget = await this.budgetSvc.findById(String(current.budgetId));

    let totalIncome = budget.totalIncome;
    let totalExpense = budget.totalExpense;
    if (current.categoryType === 'ExpenseCategory') {
      totalExpense = budget.totalExpense - current.amount;
    } else {
      totalIncome = budget.totalIncome - current.amount;
    }

    await this.budgetSvc.update(budget._id as string, {
      totalIncome,
      month: budget.month,
      totalExpense,
    });

    const deleted = await this.cashFlowModel.findByIdAndDelete(id).exec();
    if (!deleted) throw new NotFoundException('Income not found');
    return deleted;
  }
}

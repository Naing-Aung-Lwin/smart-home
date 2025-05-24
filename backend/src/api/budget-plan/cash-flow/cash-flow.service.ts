import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CashFlow } from 'src/schemas/budget-plan/cash-flow.schema';
import {
  CreateCashFlowDto,
  FilterCashFlowDto,
  UpdateCashFlowDto,
} from 'src/dtos/budget-plan/cash-flow.dto';
import { IncomeSourceService } from 'src/api/budget-plan/income-source/income-source.service';
import { BudgetService } from '../budget/budget.service';
import { ExpenseCategoryService } from 'src/api/budget-plan/expense-category/expense-category.service';
import { handleCategory } from './helpers/category.helper';
import {
  calculateBudgetAfterDelete,
  calculateUpdatedBudget,
  handleBudget,
  updateBudget,
} from './helpers/budget.helper';
import { buildCashFlowQuery } from './helpers/query.helper';
import { populateCashFlows } from './helpers/populate.helper';

@Injectable()
export class CashFlowService {
  constructor(
    @InjectModel(CashFlow.name) private cashFlowModel: Model<CashFlow>,
    private incomeSourceSvc: IncomeSourceService,
    private expenseCategorySvc: ExpenseCategoryService,
    private budgetSvc: BudgetService,
  ) {}

  async create(dto: CreateCashFlowDto): Promise<CashFlow> {
    const category = await handleCategory(
      dto.categoryType,
      dto.category,
      this.incomeSourceSvc,
      this.expenseCategorySvc,
    );

    const budget = await handleBudget(dto.date, this.budgetSvc);

    if (dto.categoryType === 'IncomeSource') {
      const totalIncome = budget.totalIncome + dto.amount;
      await updateBudget(
        budget._id as string,
        this.budgetSvc,
        totalIncome,
        budget.totalExpense,
        budget.month,
      );
    } else {
      const totalExpense = budget.totalExpense + dto.amount;
      await updateBudget(
        budget._id as string,
        this.budgetSvc,
        budget.totalIncome,
        totalExpense,
        budget.month,
      );
    }

    const created = new this.cashFlowModel({
      ...dto,
      budgetId: budget._id,
      categoryId: category._id,
    });
    return created.save();
  }

  async findAll(filter: FilterCashFlowDto): Promise<CashFlow[]> {
    const query = buildCashFlowQuery(filter);

    const cashFlows = await this.cashFlowModel
      .find(query)
      .sort({ date: -1 })
      .lean();

    const populatedCashFlows = await populateCashFlows(
      cashFlows,
      this.cashFlowModel,
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

    const categoryType = dto.categoryType
      ? dto.categoryType
      : current.categoryType;
    const category = await handleCategory(
      categoryType,
      dto.category,
      this.incomeSourceSvc,
      this.expenseCategorySvc,
    );

    const updateDto = category ? { ...dto, categoryId: category._id } : dto;

    const budgetId = dto.budgetId ? dto.budgetId : String(current.budgetId);
    const budget = await this.budgetSvc.findById(budgetId);

    const { totalIncome, totalExpense } = calculateUpdatedBudget(
      budget,
      current.amount,
      dto.amount,
      categoryType,
    );

    await this.budgetSvc.update(budget._id as string, {
      totalIncome,
      totalExpense,
      month: budget.month,
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

    const { totalIncome, totalExpense } = calculateBudgetAfterDelete(
      budget,
      current,
    );

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

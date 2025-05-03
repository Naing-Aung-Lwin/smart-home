import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MealPlan } from 'src/schemas/meal-plan.schema';
import { CreateMealPlanDto } from 'src/dtos/meal-plan/create-meal-plan.dto';
import { UpdateMealPlanDto } from 'src/dtos/meal-plan/update-meal-plan.dto';

@Injectable()
export class MealPlanService {
  constructor(
    @InjectModel(MealPlan.name) private mealPlanModel: Model<MealPlan>,
  ) {}

  async create(data: CreateMealPlanDto): Promise<MealPlan> {
    const created = new this.mealPlanModel(data);
    return created.save();
  }

  async findAll(): Promise<MealPlan[]> {
    return this.mealPlanModel
      .find()
      .populate({
        path: 'menus',
        populate: [{ path: 'meal' }, { path: 'vegetable' }],
      })
      .exec();
  }

  async findByDate(date: string): Promise<MealPlan | null> {
    const res = await this.mealPlanModel
      .findOne({ date })
      .populate({
        path: 'menus',
        populate: [{ path: 'meal' }, { path: 'vegetable' }],
      })
      .exec();
    if (!res)
      throw new NotFoundException(`Meal plan with date ${date} not found`);
    return res;
  }

  async update(
    date: string,
    updates: UpdateMealPlanDto,
  ): Promise<MealPlan | null> {
    const res = await this.mealPlanModel
      .findOneAndUpdate({ date }, updates, { new: true })
      .exec();
    if (!res)
      throw new NotFoundException(`Meal plan with date ${date} not found`);
    return res;
  }

  async delete(date: string): Promise<MealPlan | null> {
    const res = await this.mealPlanModel.findOneAndDelete({ date }).exec();
    if (!res)
      throw new NotFoundException(`Meal plan with date ${date} not found`);
    return res;
  }
}

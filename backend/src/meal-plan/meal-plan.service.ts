import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MealPlan } from './schemas/meal-plan.schema';

@Injectable()
export class MealPlanService {
  constructor(
    @InjectModel(MealPlan.name) private mealPlanModel: Model<MealPlan>,
  ) {}

  async create(data: Partial<MealPlan>): Promise<MealPlan> {
    const created = new this.mealPlanModel(data);
    return created.save();
  }

  async findAll(): Promise<MealPlan[]> {
    return this.mealPlanModel.find().exec();
  }

  async findByDate(date: string): Promise<MealPlan | null> {
    return this.mealPlanModel.findOne({ date }).exec();
  }

  async findById(id: string): Promise<MealPlan | null> {
    return this.mealPlanModel.findById(id).exec();
  }

  async update(
    date: string,
    updates: Partial<MealPlan>,
  ): Promise<MealPlan | null> {
    return this.mealPlanModel
      .findOneAndUpdate({ date }, updates, { new: true })
      .exec();
  }

  async delete(date: string): Promise<MealPlan | null> {
    return this.mealPlanModel.findOneAndDelete({ date }).exec();
  }
}

import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { MealPlan } from 'src/schemas/dining-plan/meal-plan.schema';
import { Curry } from 'src/schemas/dining-plan/curry.schema';
import { Menu } from 'src/schemas/dining-plan/menu.schema';
import { CreateMealPlanDto } from 'src/dtos/dining-plan/meal-plan/create-meal-plan.dto';
import { UpdateMealPlanDto } from 'src/dtos/dining-plan/meal-plan/update-meal-plan.dto';
import { CreateMultipleMealPlanDto } from 'src/dtos/dining-plan/meal-plan/create-multiple-meal-plan.dto';

@Injectable()
export class MealPlanService {
  constructor(
    @InjectModel(MealPlan.name) private mealPlanModel: Model<MealPlan>,
    @InjectModel(Curry.name) private curryModel: Model<Curry>,
    @InjectModel(Menu.name) private menuModel: Model<Menu>,
  ) {}

  async create(data: CreateMealPlanDto): Promise<MealPlan> {
    const created = new this.mealPlanModel(data);
    return created.save();
  }

  async createMultiple(dto: CreateMultipleMealPlanDto): Promise<MealPlan[]> {
    const { fromDate, toDate } = dto;

    const start = new Date(fromDate);
    const end = new Date(toDate);
    const result: MealPlan[] = [];

    const meals = await this.curryModel.find({ type: 'meal' });
    const vegetables = await this.curryModel.find({ type: 'vegetable' });

    if (!meals.length || !vegetables.length) {
      throw new BadRequestException('Meal or vegetable curry not found');
    }

    while (start <= end) {
      const meal = meals[Math.floor(Math.random() * meals.length)];
      const vegetable =
        vegetables[Math.floor(Math.random() * vegetables.length)];

      let menu = await this.menuModel.findOne({
        meal: meal._id,
        vegetable: vegetable._id,
      });

      if (!menu) {
        menu = new this.menuModel({ meal: meal._id, vegetable: vegetable._id });
        await menu.save();
      }

      const dateOnly = start.toISOString().split('T')[0];
      let plan = await this.mealPlanModel.findOne({ date: dateOnly });

      if (plan) {
        plan.menus = [menu._id as Types.ObjectId];
        await plan.save();
      } else {
        plan = new this.mealPlanModel({
          date: dateOnly,
          menus: [menu._id],
        });
        await plan.save();
      }

      result.push(plan);

      start.setDate(start.getDate() + 1);
    }

    return result;
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

import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { MealPlanService } from './meal-plan.service';
import { MealPlan } from 'src/schemas/meal-plan.schema';
import { CreateMealPlanDto } from 'src/dtos/meal-plan/create-meal-plan.dto';
import { UpdateMealPlanDto } from 'src/dtos/meal-plan/update-meal-plan.dto';
import { MealPlanIdParam } from 'src/dtos/meal-plan/meal-plan-id.param';

@Controller('meal-plan')
export class MealPlanController {
  constructor(private readonly mealPlanService: MealPlanService) {}

  @Get()
  getAll(): Promise<MealPlan[]> {
    try {
      return this.mealPlanService.findAll();
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Get(':date')
  async getByDate(@Param() params: MealPlanIdParam): Promise<MealPlan> {
    try {
      const plan = await this.mealPlanService.findByDate(params.date);
      if (!plan) throw new NotFoundException('Meal plan not found');
      return plan;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Post()
  create(@Body() data: CreateMealPlanDto): Promise<MealPlan> {
    try {
      return this.mealPlanService.create(data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Put(':date')
  update(
    @Param() params: MealPlanIdParam,
    @Body() updates: UpdateMealPlanDto,
  ): Promise<MealPlan | null> {
    try {
      return this.mealPlanService.update(params.date, updates);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Delete(':date')
  delete(@Param() params: MealPlanIdParam): Promise<MealPlan | null> {
    try {
      return this.mealPlanService.delete(params.date);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}

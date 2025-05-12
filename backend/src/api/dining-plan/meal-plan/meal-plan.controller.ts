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
  Query,
} from '@nestjs/common';
import { MealPlanService } from './meal-plan.service';
import { MealPlan } from 'src/schemas/dining-plan/meal-plan.schema';
import { CreateMealPlanDto } from 'src/dtos/dining-plan/meal-plan/create-meal-plan.dto';
import { UpdateMealPlanDto } from 'src/dtos/dining-plan/meal-plan/update-meal-plan.dto';
import { MealPlanIdParam } from 'src/dtos/dining-plan/meal-plan/meal-plan-id.param';
import { ApiParam } from '@nestjs/swagger';
import { CreateMultipleMealPlanDto } from 'src/dtos/dining-plan/meal-plan/create-multiple-meal-plan.dto';
import { SearchMenuPlan } from 'src/dtos/dining-plan/meal-plan/search-menu-plan.dto';

@Controller('meal-plan')
export class MealPlanController {
  constructor(private readonly mealPlanService: MealPlanService) {}

  @Post()
  create(@Body() data: CreateMealPlanDto): Promise<MealPlan> {
    try {
      return this.mealPlanService.create(data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Post('generate')
  async generateMealPlans(@Body() dto: CreateMultipleMealPlanDto) {
    return this.mealPlanService.createMultiple(dto);
  }

  @Get()
  getAll(@Query() query: SearchMenuPlan): Promise<MealPlan[]> {
    try {
      return this.mealPlanService.findAll(query);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Get(':date')
  @ApiParam({
    name: 'date',
    type: String,
    description: 'Date in the format YYYY-MM-DD',
  })
  async getByDate(@Param() params: MealPlanIdParam): Promise<MealPlan> {
    try {
      const plan = await this.mealPlanService.findByDate(params.date);
      if (!plan) throw new NotFoundException('Meal plan not found');
      return plan;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Put(':date')
  @ApiParam({
    name: 'date',
    type: String,
    description: 'Date in the format YYYY-MM-DD',
  })
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
  @ApiParam({
    name: 'date',
    type: String,
    description: 'Date in the format YYYY-MM-DD',
  })
  delete(@Param() params: MealPlanIdParam): Promise<MealPlan | null> {
    try {
      return this.mealPlanService.delete(params.date);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}

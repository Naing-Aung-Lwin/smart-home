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
import { MealPlan } from './schemas/meal-plan.schema';
import * as CONST from 'src/constants';

@Controller('meal-plan')
export class MealPlanController {
  constructor(private readonly mealPlanService: MealPlanService) {}

  private api_name = 'meal plan';

  @Get()
  getAll(): Promise<MealPlan[]> {
    try {
      return this.mealPlanService.findAll();
    } catch (error) {
      const msg_prefix = `${CONST.FAIL_TO_FETCH} ${this.api_name}`;
      const msg = (error as Error)?.message
        ? msg_prefix + ' >> ' + (error as Error)?.message
        : msg_prefix;
      throw new BadRequestException(msg);
    }
  }

  @Get(':date')
  async getByDate(@Param('date') date: string): Promise<MealPlan> {
    try {
      const plan = await this.mealPlanService.findByDate(date);
      if (!plan) throw new NotFoundException('Meal plan not found');
      return plan;
    } catch (error) {
      const msg_prefix = `${CONST.FAIL_TO_FETCH} ${this.api_name} date : ${date}`;
      const msg = (error as Error)?.message
        ? msg_prefix + ' >> ' + (error as Error)?.message
        : msg_prefix;
      throw new BadRequestException(msg);
    }
  }

  @Post()
  create(@Body() data: Partial<MealPlan>): Promise<MealPlan> {
    try {
      return this.mealPlanService.create(data);
    } catch (error) {
      const msg_prefix = `${CONST.FAIL_TO_CREATE} ${this.api_name}`;
      const msg = (error as Error)?.message
        ? msg_prefix + ' >> ' + (error as Error)?.message
        : msg_prefix;
      throw new BadRequestException(msg);
    }
  }

  @Put(':date')
  update(
    @Param('date') date: string,
    @Body() updates: Partial<MealPlan>,
  ): Promise<MealPlan | null> {
    try {
      return this.mealPlanService.update(date, updates);
    } catch (error) {
      const msg_prefix = `${CONST.FAIL_TO_UPDATE} ${this.api_name} date : ${date}`;
      const msg = (error as Error)?.message
        ? msg_prefix + ' >> ' + (error as Error)?.message
        : msg_prefix;
      throw new BadRequestException(msg);
    }
  }

  @Delete(':date')
  delete(@Param('date') date: string): Promise<MealPlan | null> {
    try {
      return this.mealPlanService.delete(date);
    } catch (error) {
      const msg_prefix = `${CONST.FAIL_TO_DELETE} ${this.api_name} date : ${date}`;
      const msg = (error as Error)?.message
        ? msg_prefix + ' >> ' + (error as Error)?.message
        : msg_prefix;
      throw new BadRequestException(msg);
    }
  }
}

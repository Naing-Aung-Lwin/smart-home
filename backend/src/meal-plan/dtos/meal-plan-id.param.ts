import { IsDateString } from 'class-validator';

export class MealPlanIdParam {
  @IsDateString()
  date: string;
}

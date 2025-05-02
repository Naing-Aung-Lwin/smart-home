import { IsMongoId } from 'class-validator';

export class MealPlanIdParam {
  @IsMongoId()
  id: string;
}

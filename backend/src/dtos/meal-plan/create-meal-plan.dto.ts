import { IsArray, IsDateString, IsMongoId } from 'class-validator';

export class CreateMealPlanDto {
  @IsDateString()
  date: string;

  @IsArray()
  @IsMongoId({ each: true })
  menus: string[];
}

import { IsDateString, IsArray, IsMongoId, IsOptional } from 'class-validator';

export class UpdateMealPlanDto {
  @IsDateString()
  @IsOptional()
  date?: string;

  @IsArray()
  @IsMongoId({ each: true })
  @IsOptional()
  menus?: string[];
}

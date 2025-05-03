import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsArray, IsMongoId, IsOptional } from 'class-validator';

export class UpdateMealPlanDto {
  @IsDateString()
  @IsOptional()
  @ApiProperty({
    example: '2025-05-03',
    description: 'The date of the meal plan',
  })
  date?: string;

  @IsArray()
  @IsMongoId({ each: true })
  @IsOptional()
  @ApiProperty({
    example: '[]',
    description: 'The array of menu IDs',
  })
  menus?: string[];
}

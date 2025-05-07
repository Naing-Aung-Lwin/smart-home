import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsDateString, IsMongoId } from 'class-validator';

export class CreateMealPlanDto {
  @IsDateString()
  @ApiProperty({
    example: '2025-05-03',
    description: 'The date of the meal plan',
  })
  date: string;

  @IsArray()
  @IsMongoId({ each: true })
  @ApiProperty({
    example: '[]',
    description: 'The array of menu IDs',
  })
  menus: string[];
}

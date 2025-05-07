import { IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMultipleMealPlanDto {
  @ApiProperty({ example: 'YYYY-MM-DD' })
  @IsDateString()
  fromDate: string;

  @ApiProperty({ example: 'YYYY-MM-DD' })
  @IsDateString()
  toDate: string;
}

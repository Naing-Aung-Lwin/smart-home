import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsOptional,
  Matches,
} from 'class-validator';

export class CreateBudgetDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{4}-(0[1-9]|1[0-2])$/, {
    message: 'month must be in the format YYYY-MM',
  })
  @ApiProperty({
    example: '2025-05',
    description: 'Month in the format YYYY-MM',
  })
  month: string;

  @IsNumber()
  @ApiProperty({
    example: '10000',
    description: 'Total income',
  })
  totalIncome: number;

  @IsNumber()
  @ApiProperty({
    example: '5000',
    description: 'Total expense',
  })
  totalExpense: number;
}

export class UpdateBudgetDto {
  @IsString()
  @IsOptional()
  @Matches(/^\d{4}-(0[1-9]|1[0-2])$/, {
    message: 'month must be in the format YYYY-MM',
  })
  @ApiProperty({
    example: '2025-05',
    description: 'Month in the format YYYY-MM',
  })
  month: string;

  @IsNumber()
  @IsOptional()
  @ApiProperty({
    example: '10000',
    description: 'Total income',
  })
  totalIncome: number;

  @IsNumber()
  @IsOptional()
  @ApiProperty({
    example: '5000',
    description: 'Total expense',
  })
  totalExpense: number;
}

import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateCashFlowDto {
  @IsString()
  @ApiProperty({
    example: 'Food',
    description: 'Category of the expense',
  })
  category: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'ExpenseCategory',
    description: 'Category type (ExpenseCategory or IncomeSource)',
  })
  @IsEnum(['ExpenseCategory', 'IncomeSource'])
  categoryType: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    example: 50,
    description: 'Amount of the expense',
  })
  amount: number;

  @IsDateString()
  @IsNotEmpty()
  @ApiProperty({
    example: '2025-05-05',
    description: 'Date of the expense',
  })
  date: string;

  @IsMongoId()
  @ApiProperty({
    example: 'Budget ID (MongoDB ObjectId)',
    description: 'Budget associated with the income',
  })
  budgetId: string;
}

export class UpdateCashFlowDto {
  @IsString()
  @IsOptional()
  @ApiProperty({
    example: 'Food',
    description: 'Category of the expense',
  })
  category: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @ApiProperty({
    example: 'ExpenseCategory',
    description: 'Category type (ExpenseCategory or IncomeSource)',
  })
  @IsEnum(['ExpenseCategory', 'IncomeSource'])
  categoryType: string;

  @IsNumber()
  @IsNotEmpty()
  @IsOptional()
  @ApiProperty({
    example: 50,
    description: 'Amount of the expense',
  })
  amount: number;

  @IsDateString()
  @IsNotEmpty()
  @IsOptional()
  @ApiProperty({
    example: '2025-05-05',
    description: 'Date of the expense',
  })
  date: string;

  @IsMongoId()
  @IsOptional()
  @ApiProperty({
    example: 'Budget ID (MongoDB ObjectId)',
    description: 'Budget associated with the income',
  })
  budgetId: string;
}

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

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'Food',
    description: 'Category of the expense',
  })
  description: string;

  @IsDateString()
  @IsNotEmpty()
  @ApiProperty({
    example: '2025-05-05',
    description: 'Date of the expense',
  })
  date: string;

  @IsMongoId()
  @IsOptional()
  @ApiProperty({
    example: 'ExpenseCategory or IncomeSource ID (MongoDB ObjectId)',
    description: 'Category associated with the expense or income',
  })
  categoryId: string;

  @IsOptional()
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
  @IsOptional()
  @ApiProperty({
    example: 50,
    description: 'Amount of the expense',
  })
  amount: number;

  @IsString()
  @IsOptional()
  @ApiProperty({
    example: 'Food',
    description: 'Category of the expense',
  })
  description: string;

  @IsDateString()
  @IsOptional()
  @ApiProperty({
    example: '2025-05-05',
    description: 'Date of the expense',
  })
  date: string;

  @IsMongoId()
  @IsOptional()
  @ApiProperty({
    example: 'ExpenseCategory or IncomeSource ID (MongoDB ObjectId)',
    description: 'Category associated with the expense or income',
  })
  categoryId: string;

  @IsMongoId()
  @IsOptional()
  @ApiProperty({
    example: 'Budget ID (MongoDB ObjectId)',
    description: 'Budget associated with the income',
  })
  budgetId: string;
}

export class FilterCashFlowDto {
  @IsMongoId()
  @IsOptional()
  @ApiProperty({
    description: 'Category associated with the income or expense',
    required: false,
  })
  categoryId: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Category type (ExpenseCategory or IncomeSource)',
    required: false,
  })
  @IsEnum(['ExpenseCategory', 'IncomeSource'])
  categoryType: string;

  @IsNumber()
  @IsOptional()
  @ApiProperty({
    description: 'Minimum amount of the income or expense',
    required: false,
  })
  minAmount: number;

  @IsNumber()
  @IsOptional()
  @ApiProperty({
    description: 'Maximum amount of the income or expense',
    required: false,
  })
  maxAmount: number;

  @IsDateString()
  @IsOptional()
  @ApiProperty({
    description: 'Start date of the income or expense',
    required: false,
  })
  startDate: string;

  @IsDateString()
  @IsOptional()
  @ApiProperty({
    description: 'End date of the income or expense',
    required: false,
  })
  endDate: string;

  @IsMongoId()
  @IsOptional()
  @ApiProperty({
    description: 'Budget associated with the income',
    required: false,
  })
  budgetId: string;
}

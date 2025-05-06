import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateExpenseDto {
  @IsString()
  @ApiProperty({
    example: 'Food',
    description: 'Category of the expense',
  })
  category: string;

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

export class UpdateExpenseDto {
  @IsOptional()
  @ApiProperty({
    example: 'Food',
    description: 'Category of the expense',
  })
  category: string;

  @IsNumber()
  @IsOptional()
  @ApiProperty({
    example: 50,
    description: 'Amount of the expense',
  })
  amount: number;

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
    example: 'Budget ID (MongoDB ObjectId)',
    description: 'Budget associated with the income',
  })
  budgetId: string;
}

export class CreateExpenseCategoryDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'Food',
    description: 'Name of the expense category',
  })
  name: string;
}

export class UpdateExpenseCategoryDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'Food',
    description: 'Name of the expense category',
  })
  name: string;
}

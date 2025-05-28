import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateSavingDto {
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    example: 100000,
    description: 'Amount of money to save',
  })
  amount: number;

  @IsDateString()
  @IsNotEmpty()
  @ApiProperty({
    example: '2023-10-01',
    description: 'Date of the saving',
  })
  date: string;

  @IsString()
  @ApiProperty({
    example: 'Saving from salary',
    description: 'Description of the saving (optional)',
    required: false,
  })
  description: string;

  @IsOptional()
  @IsMongoId()
  @ApiProperty({
    example: 'Budget ID (MongoDB ObjectId)',
    description: 'Budget associated with the saving',
  })
  budgetId?: string;
}

export class UpdateSavingDto {
  @IsNumber()
  @IsOptional()
  @ApiProperty({
    example: 100000,
    description: 'Amount of money to save',
    required: false,
  })
  amount: number;

  @IsDateString()
  @IsOptional()
  @ApiProperty({
    example: '2023-10-01',
    description: 'Date of the saving',
    required: false,
  })
  date: string;

  @IsOptional()
  @ApiProperty({
    example: 'Saving from salary',
    description: 'Description of the saving (optional)',
    required: false,
  })
  description: string;

  @IsOptional()
  @IsMongoId()
  @ApiProperty({
    example: 'Budget ID (MongoDB ObjectId)',
    description: 'Budget associated with the saving',
  })
  budgetId: string;
}

export class FilterSavingDto {
  @IsDateString()
  @IsOptional()
  @ApiProperty({
    description: 'Start date of the saving',
    required: false,
  })
  fromDate: string;

  @IsDateString()
  @IsOptional()
  @ApiProperty({
    description: 'End date of the saving',
    required: false,
  })
  toDate: string;
}

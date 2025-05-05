import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateIncomeDto {
  @IsNotEmpty()
  @ApiProperty({
    example: 'Income Source',
    description: 'Source of the income',
  })
  source: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    example: 1000,
    description: 'Amount of the income',
  })
  amount: number;

  @IsDateString()
  @IsNotEmpty()
  @ApiProperty({
    example: '2023-09-01',
    description: 'Date of the income',
  })
  date: string;
}

export class UpdateIncomeDto {
  @IsOptional()
  @ApiProperty({
    example: 'Income Source ID (MongoDB ObjectId)',
    description: 'Source of the income',
  })
  source: string;

  @IsNumber()
  @IsOptional()
  @ApiProperty({
    example: 1000,
    description: 'Amount of the income',
  })
  amount: number;

  @IsDateString()
  @IsOptional()
  @ApiProperty({
    example: '2023-09-01',
    description: 'Date of the income',
  })
  date: string;
}

export class CreateIncomeSourceDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'Salary',
    description: 'Name of the income source',
  })
  name: string;
}

export class UpdateIncomeSourceDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'Salary',
    description: 'Name of the income source',
  })
  name: string;
}

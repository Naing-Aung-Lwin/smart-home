import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

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

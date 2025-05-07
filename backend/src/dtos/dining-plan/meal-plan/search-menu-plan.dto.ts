import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsOptional } from 'class-validator';

export class SearchMenuPlan {
  @IsDateString()
  @IsOptional()
  @ApiProperty({
    required: false,
  })
  fromDate: string;

  @IsDateString()
  @IsOptional()
  @ApiProperty({
    required: false,
  })
  toDate: string;
}

import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class SearchMenu {
  @IsString()
  @IsOptional()
  @ApiProperty({
    required: false,
  })
  name: string;
}

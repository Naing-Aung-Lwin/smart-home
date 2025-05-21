import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsOptional, IsString } from 'class-validator';

export class SearchMenu {
  @IsString()
  @IsOptional()
  @IsMongoId()
  @ApiProperty({
    required: false,
  })
  meal: string;

  @IsString()
  @IsOptional()
  @IsMongoId()
  @ApiProperty({
    required: false,
  })
  vegetable: string;
}

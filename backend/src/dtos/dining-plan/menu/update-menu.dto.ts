import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsMongoId } from 'class-validator';

export class UpdateMenuDto {
  @IsMongoId()
  @IsOptional()
  @ApiProperty({
    example: 'Curry ID (MongoDB ObjectId)',
    description: 'The name of the meal',
  })
  meal?: string;

  @IsMongoId()
  @IsOptional()
  @ApiProperty({
    example: 'Curry ID (MongoDB ObjectId)',
    description: 'The vegetable side',
  })
  vegetable?: string;
}

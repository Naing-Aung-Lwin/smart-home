import { IsNotEmpty, IsMongoId } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMenuDto {
  @IsMongoId()
  @IsNotEmpty()
  @ApiProperty({
    example: 'Curry ID (MongoDB ObjectId)',
    description: 'The name of the meal',
  })
  meal: string;

  @IsMongoId()
  @IsNotEmpty()
  @ApiProperty({
    example: 'Curry ID (MongoDB ObjectId)',
    description: 'The vegetable side',
  })
  vegetable: string;
}

import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEnum } from 'class-validator';
import { CurryType } from 'src/schemas/dining-plan/curry.schema';

export class CreateCurryDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'Chicken',
    description: 'The name of the curry',
  })
  name: string;

  @IsEnum(CurryType)
  @ApiProperty({
    example: 'meal',
    description: 'The type of the curry (e.g., meal, vegetable, other)',
  })
  type: CurryType;
}

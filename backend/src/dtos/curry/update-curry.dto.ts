import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEnum, IsOptional } from 'class-validator';
import { CurryType } from 'src/schemas/curry.schema';

export class UpdateCurryDto {
  @IsString()
  @IsOptional()
  @ApiProperty({
    example: 'Chicken',
    description: 'The name of the curry',
  })
  name: string;

  @IsEnum(CurryType)
  @IsOptional()
  @ApiProperty({
    example: 'meal',
    description: 'The type of the curry (e.g., meal, vegetable, other)',
  })
  type: CurryType;
}

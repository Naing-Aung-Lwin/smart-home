import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { CurryType } from 'src/schemas/dining-plan/curry.schema';

export class SearchCurry {
  @IsString()
  @IsOptional()
  @ApiProperty({
    required: false,
  })
  name: string;

  @IsEnum(CurryType)
  @IsOptional()
  @ApiProperty({
    required: false,
  })
  type: string;
}

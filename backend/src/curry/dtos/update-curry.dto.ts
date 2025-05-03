import { IsString, IsEnum, IsOptional } from 'class-validator';
import { CurryType } from '../schemas/curry.schema';

export class UpdateCurryDto {
  @IsString()
  @IsOptional()
  name: string;

  @IsEnum(CurryType)
  @IsOptional()
  type: CurryType;
}

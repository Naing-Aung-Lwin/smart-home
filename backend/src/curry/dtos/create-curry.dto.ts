import { IsString, IsNotEmpty, IsEnum } from 'class-validator';
import { CurryType } from '../schemas/curry.schema';

export class CreateCurryDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEnum(CurryType)
  type: CurryType;
}

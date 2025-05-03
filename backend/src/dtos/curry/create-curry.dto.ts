import { IsString, IsNotEmpty, IsEnum } from 'class-validator';
import { CurryType } from 'src/schemas/curry.schema';

export class CreateCurryDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEnum(CurryType)
  type: CurryType;
}

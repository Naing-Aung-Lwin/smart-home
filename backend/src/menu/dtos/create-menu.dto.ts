import { IsString, IsNotEmpty } from 'class-validator';

export class CreateMenuDto {
  @IsString()
  @IsNotEmpty()
  meal: string;

  @IsString()
  @IsNotEmpty()
  vegetable: string;
}

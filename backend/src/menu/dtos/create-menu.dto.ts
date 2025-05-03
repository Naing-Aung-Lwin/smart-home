import { IsNotEmpty, IsMongoId } from 'class-validator';

export class CreateMenuDto {
  @IsMongoId()
  @IsNotEmpty()
  meal: string;

  @IsMongoId()
  @IsNotEmpty()
  vegetable: string;
}

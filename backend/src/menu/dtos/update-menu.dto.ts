import { IsOptional, IsMongoId } from 'class-validator';

export class UpdateMenuDto {
  @IsMongoId()
  @IsOptional()
  meal?: string;

  @IsMongoId()
  @IsOptional()
  vegetable?: string;
}

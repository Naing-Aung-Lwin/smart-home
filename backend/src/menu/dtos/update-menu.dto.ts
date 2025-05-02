import { IsString, IsOptional } from 'class-validator';

export class UpdateMenuDto {
  @IsString()
  @IsOptional()
  meal?: string;

  @IsString()
  @IsOptional()
  vegetable?: string;
}

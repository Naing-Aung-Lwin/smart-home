import { IsMongoId } from 'class-validator';

export class MenuIdParam {
  @IsMongoId()
  id: string;
}

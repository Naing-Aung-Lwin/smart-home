import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CurryDocument = Curry & Document;

export enum CurryType {
  MEAL = 'meal',
  VEGETABLE = 'vegetable',
  OTHER = 'other',
}

@Schema()
export class Curry {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, enum: CurryType })
  type: CurryType;
}

export const CurrySchema = SchemaFactory.createForClass(Curry);

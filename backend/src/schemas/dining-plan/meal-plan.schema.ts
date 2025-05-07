import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class MealPlan extends Document {
  @Prop({ required: true, unique: true })
  date: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Menu' }] })
  menus: Types.ObjectId[];
}

export const MealPlanSchema = SchemaFactory.createForClass(MealPlan);

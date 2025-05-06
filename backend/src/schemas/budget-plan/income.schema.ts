import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Income extends Document {
  @Prop({ type: Types.ObjectId, ref: 'IncomeSource', required: true })
  source: Types.ObjectId;

  @Prop({ required: true })
  amount: number;

  @Prop({ required: true })
  date: string;

  @Prop({ type: Types.ObjectId, ref: 'Budget', required: true })
  budgetId: Types.ObjectId;
}

export const IncomeSchema = SchemaFactory.createForClass(Income);

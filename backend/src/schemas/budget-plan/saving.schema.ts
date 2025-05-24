import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class Saving extends Document {
  @Prop({ required: true })
  amount: number;

  @Prop({ required: true })
  date: string;

  @Prop({ required: false })
  description: string;

  @Prop({ type: Types.ObjectId, ref: 'CashFlow', required: false })
  incomeId: Types.ObjectId;
}

export const SavingSchema = SchemaFactory.createForClass(Saving);

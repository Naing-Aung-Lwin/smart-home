import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Budget extends Document {
  @Prop({ required: true })
  month: string; // format: '2025-05'

  @Prop({ default: 0 })
  totalIncome: number;

  @Prop({ default: 0 })
  totalExpense: number;
}

export const BudgetSchema = SchemaFactory.createForClass(Budget);

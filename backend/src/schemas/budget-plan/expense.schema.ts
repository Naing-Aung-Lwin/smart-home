import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Expense extends Document {
  @Prop({ type: Types.ObjectId, ref: 'ExpenseCategory', required: true })
  category: Types.ObjectId;

  @Prop({ required: true })
  amount: number;

  @Prop({ required: true })
  date: string;

  @Prop({ type: Types.ObjectId, ref: 'Budget', required: true })
  budgetId: Types.ObjectId;
}

export const ExpenseSchema = SchemaFactory.createForClass(Expense);

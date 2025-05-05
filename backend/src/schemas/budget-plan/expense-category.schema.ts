import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class ExpenseCategory extends Document {
  @Prop({ required: true, unique: true })
  name: string; // e.g., "Food", "Rent", "Travel", etc.
}

export const ExpenseCategorySchema =
  SchemaFactory.createForClass(ExpenseCategory);

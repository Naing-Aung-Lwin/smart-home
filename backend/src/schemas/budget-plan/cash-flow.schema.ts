import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class CashFlow extends Document {
  @Prop({ type: Types.ObjectId, required: true })
  categoryId: Types.ObjectId;

  @Prop({
    type: String,
    enum: ['ExpenseCategory', 'IncomeSource'],
    required: true,
  })
  categoryType: string;

  @Prop({ required: true })
  amount: number;

  @Prop({ required: true })
  date: string;

  @Prop({ type: Types.ObjectId, ref: 'Budget', required: true })
  budgetId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Saving', required: false })
  savingId: Types.ObjectId;
}

export const CashFlowSchema = SchemaFactory.createForClass(CashFlow);

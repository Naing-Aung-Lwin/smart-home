import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class IncomeSource extends Document {
  @Prop({ required: true, unique: true })
  name: string; // e.g., "Salary", "Freelance", etc.
}

export const IncomeSourceSchema = SchemaFactory.createForClass(IncomeSource);

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class Menu extends Document {
  @Prop({ type: Types.ObjectId, ref: 'Curry', required: true })
  meal: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Curry', required: true })
  vegetable: Types.ObjectId;
}

export const MenuSchema = SchemaFactory.createForClass(Menu);

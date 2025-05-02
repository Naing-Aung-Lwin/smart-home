import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Menu extends Document {
  @Prop({ required: true })
  meal: string;

  @Prop({ required: true })
  vegetable: string;
}

export const MenuSchema = SchemaFactory.createForClass(Menu);

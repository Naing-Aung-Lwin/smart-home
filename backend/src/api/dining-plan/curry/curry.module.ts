import { Module } from '@nestjs/common';
import { CurryService } from './curry.service';
import { CurryController } from './curry.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Curry, CurrySchema } from 'src/schemas/dining-plan/curry.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Curry.name, schema: CurrySchema }]),
  ],
  providers: [CurryService],
  controllers: [CurryController],
})
export class CurryModule {}

import { Module } from '@nestjs/common';
import { SavingService } from './saving.service';
import { SavingController } from './saving.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Saving, SavingSchema } from 'src/schemas/budget-plan/saving.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Saving.name,
        schema: SavingSchema,
      },
    ]),
  ],
  providers: [SavingService],
  controllers: [SavingController],
})
export class SavingModule {}

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  IncomeSource,
  IncomeSourceSchema,
} from 'src/schemas/budget-plan/income-source.schema';
import { IncomeSourceService } from './income-source.service';
import { IncomeSourceController } from './income-source.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: IncomeSource.name, schema: IncomeSourceSchema },
    ]),
  ],
  providers: [IncomeSourceService],
  controllers: [IncomeSourceController],
})
export class IncomeSourceModule {}

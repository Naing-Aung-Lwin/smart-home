import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Income, IncomeSchema } from 'src/schemas/budget-plan/income.schema';
import {
  IncomeSource,
  IncomeSourceSchema,
} from 'src/schemas/budget-plan/income-source.schema';
import { IncomeService } from './income.service';
import { IncomeController } from './income.controller';
import { IncomeSourceService } from 'src/api/budget-plan/income-source/income-source.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Income.name, schema: IncomeSchema },
      {
        name: IncomeSource.name,
        schema: IncomeSourceSchema,
      },
    ]),
  ],
  providers: [IncomeService, IncomeSourceService],
  controllers: [IncomeController],
})
export class IncomeModule {}

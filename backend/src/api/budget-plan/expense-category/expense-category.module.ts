import { Module } from '@nestjs/common';
import { ExpenseCategoryService } from './expense-category.service';
import { ExpenseCategoryController } from './expense-category.controller';
import {
  ExpenseCategory,
  ExpenseCategorySchema,
} from 'src/schemas/budget-plan/expense-category.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ExpenseCategory.name, schema: ExpenseCategorySchema },
    ]),
  ],
  providers: [ExpenseCategoryService],
  controllers: [ExpenseCategoryController],
})
export class ExpenseCategoryModule {}

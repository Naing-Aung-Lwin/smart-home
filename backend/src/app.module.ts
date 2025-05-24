import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { MenuModule } from 'src/api/dining-plan/menu/menu.module';
import { MealPlanModule } from 'src/api/dining-plan/meal-plan/meal-plan.module';
import { CurryModule } from 'src/api/dining-plan/curry/curry.module';
import { IncomeSourceModule } from 'src/api/budget-plan/income-source/income-source.module';
import { BudgetModule } from './api/budget-plan/budget/budget.module';
import { ExpenseCategoryModule } from './api/budget-plan/expense-category/expense-category.module';
import { CashFlowModule } from './api/budget-plan/cash-flow/cash-flow.module';
import { SavingModule } from './api/budget-plan/saving/saving.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
      }),
      inject: [ConfigService],
    }),
    CurryModule,
    MenuModule,
    MealPlanModule,
    BudgetModule,
    CashFlowModule,
    IncomeSourceModule,
    ExpenseCategoryModule,
    SavingModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

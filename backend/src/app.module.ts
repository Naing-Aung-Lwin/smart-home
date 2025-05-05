import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { MenuModule } from 'src/api/menu/menu.module';
import { MealPlanModule } from 'src/api/meal-plan/meal-plan.module';
import { CurryModule } from 'src/api/curry/curry.module';
import { IncomeModule } from 'src/api/budget-plan/income/income.module';
import { IncomeSourceModule } from 'src/api/budget-plan/income-source/income-source.module';
import { BudgetModule } from './api/budget-plan/budget/budget.module';

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
    MenuModule,
    MealPlanModule,
    CurryModule,
    IncomeModule,
    IncomeSourceModule,
    BudgetModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MenuModule } from './api/menu/menu.module';
import { MealPlanModule } from './api/meal-plan/meal-plan.module';
import { CurryModule } from './api/curry/curry.module';

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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

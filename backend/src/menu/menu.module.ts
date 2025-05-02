import { Module } from '@nestjs/common';
import { MenuService } from './menu.service';
import { MenuController } from './menu.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Menu, MenuSchema } from './schemas/menu.schema';
import {
  MealPlan,
  MealPlanSchema,
} from 'src/meal-plan/schemas/meal-plan.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Menu.name, schema: MenuSchema },
      { name: MealPlan.name, schema: MealPlanSchema },
    ]),
  ],
  providers: [MenuService],
  controllers: [MenuController],
})
export class MenuModule {}

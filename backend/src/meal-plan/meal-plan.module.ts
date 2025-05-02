import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MealPlanController } from './meal-plan.controller';
import { MealPlanService } from './meal-plan.service';
import { MealPlan, MealPlanSchema } from './schemas/meal-plan.schema';
import { Menu, MenuSchema } from 'src/menu/schemas/menu.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: MealPlan.name, schema: MealPlanSchema },
      { name: Menu.name, schema: MenuSchema },
    ]),
  ],
  controllers: [MealPlanController],
  providers: [MealPlanService],
})
export class MealPlanModule {}

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MealPlanController } from './meal-plan.controller';
import { MealPlanService } from './meal-plan.service';
import { MealPlan, MealPlanSchema } from 'src/schemas/meal-plan.schema';
import { Menu, MenuSchema } from 'src/schemas/menu.schema';
import { Curry, CurrySchema } from 'src/schemas/curry.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: MealPlan.name, schema: MealPlanSchema },
      { name: Menu.name, schema: MenuSchema },
      { name: Curry.name, schema: CurrySchema },
    ]),
  ],
  controllers: [MealPlanController],
  providers: [MealPlanService],
})
export class MealPlanModule {}

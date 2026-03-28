import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NutritionPlan } from '../database/entities/nutrition-plan.entity';
import { ParentMealSelection } from '../database/entities/parent-meal-selection.entity';
import { SelectedMealPlanItem } from '../database/entities/selected-meal-plan-item.entity';
import { NutritionController } from './nutrition.controller';
import { NutritionService } from './nutrition.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      NutritionPlan,
      ParentMealSelection,
      SelectedMealPlanItem,
    ]),
  ],
  controllers: [NutritionController],
  providers: [NutritionService],
  exports: [NutritionService],
})
export class NutritionModule {}

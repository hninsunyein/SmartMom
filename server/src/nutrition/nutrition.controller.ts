import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { NutritionService } from './nutrition.service';

@Controller('nutrition')
@UseGuards(JwtAuthGuard)
export class NutritionController {
  constructor(private readonly nutritionService: NutritionService) {}

  @Get('plans/child/:childId')
  async getPlans(@Param('childId') childId: string) {
    return this.nutritionService.findByChild(+childId);
  }

  @Post('plans')
  async createPlan(@Body() body: any) {
    return this.nutritionService.createPlan(body);
  }

  @Post('generate')
  async generateMealPlan(@Body() body: { ageGroup: string; goals: string[] }) {
    return this.nutritionService.generateMealPlan(body.ageGroup, body.goals);
  }

  @Post('calculate')
  async calculateCalories(@Body() body: { foodItem: string; amount: number }) {
    return this.nutritionService.calculateCalories(body.foodItem, body.amount);
  }
}

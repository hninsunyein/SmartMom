import {
  Controller, Get, Post, Delete, Body, Param, Query,
  UseGuards, Req,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { NutritionService } from './nutrition.service';
import { PlanType } from '../database/entities/user.entity';

@Controller('nutrition')
@UseGuards(JwtAuthGuard)
export class NutritionController {
  constructor(private readonly nutritionService: NutritionService) {}

  // ── Legacy ─────────────────────────────────────────────────────────────────

  @Get('plans/child/:childId')
  getPlans(@Param('childId') childId: string) {
    return this.nutritionService.findByChild(+childId);
  }

  @Post('plans')
  createPlan(@Body() body: any) {
    return this.nutritionService.createPlan(body);
  }

  @Post('generate')
  generateMealPlan(@Body() body: { ageGroup: string; goals: string[] }) {
    return this.nutritionService.generateMealPlan(body.ageGroup, body.goals);
  }

  @Post('calculate')
  calculateCalories(@Body() body: { foodItem: string; amount: number }) {
    return this.nutritionService.calculateCalories(body.foodItem, body.amount);
  }

  // ── Monthly restriction ────────────────────────────────────────────────────

  @Get('child/:childId/monthly-check')
  checkMonthlyPlan(@Param('childId') childId: string) {
    return this.nutritionService.checkCurrentMonthPlan(+childId);
  }

  @Delete('child/:childId/current-month-plan')
  deleteCurrentMonthPlan(@Req() req, @Param('childId') childId: string) {
    return this.nutritionService.deleteCurrentMonthPlan(req.user.id, +childId);
  }

  // ── Meal selection (save) ─────────────────────────────────────────────────

  @Post('meal-selections')
  saveMealSelection(@Req() req, @Body() body: any) {
    const isPremium = req.user.planType === PlanType.PREMIUM;
    return this.nutritionService.saveMealSelection(req.user.id, isPremium, body);
  }

  @Get('meal-selections/child/:childId/active')
  getActivePlan(@Req() req, @Param('childId') childId: string) {
    return this.nutritionService.getActivePlan(req.user.id, +childId);
  }

  @Get('meal-selections/child/:childId/check')
  checkFreePlanExists(@Req() req, @Param('childId') childId: string) {
    return this.nutritionService.checkFreePlanExists(req.user.id, +childId);
  }

  @Get('meal-selections/child/:childId/history')
  getPlanHistory(@Req() req, @Param('childId') childId: string) {
    const isPremium = req.user.planType === PlanType.PREMIUM;
    return this.nutritionService.getPlanHistory(req.user.id, +childId, isPremium);
  }

  @Get('meal-selections/:id/shopping-list')
  getShoppingList(@Req() req, @Param('id') id: string) {
    const isPremium = req.user.planType === PlanType.PREMIUM;
    return this.nutritionService.getShoppingList(req.user.id, +id, isPremium);
  }

  // ── View specific month's plan ─────────────────────────────────────────────

  @Get('child/:childId/month-plan')
  getMonthPlan(
    @Req() req,
    @Param('childId') childId: string,
    @Query('year') year: string,
    @Query('month') month: string,
  ) {
    const isPremium = req.user.planType === PlanType.PREMIUM;
    return this.nutritionService.getMonthPlan(+childId, +year, +month, isPremium);
  }
}

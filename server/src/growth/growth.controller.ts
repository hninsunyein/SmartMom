import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GrowthService } from './growth.service';

@Controller('growth')
@UseGuards(JwtAuthGuard)
export class GrowthController {
  constructor(private readonly growthService: GrowthService) {}

  @Get('child/:childId')
  async getGrowthHistory(@Param('childId') childId: string) {
    return this.growthService.findByChild(+childId);
  }

  @Post()
  async addMeasurement(@Request() req, @Body() body: any) {
    return this.growthService.create(body);
  }
}

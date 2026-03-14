import { Controller, Get, Post, Body, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TipsService } from './tips.service';

@Controller('tips')
@UseGuards(JwtAuthGuard)
export class TipsController {
  constructor(private readonly tipsService: TipsService) {}

  @Get()
  async getTips(@Query('type') type?: string, @Query('ageGroup') ageGroup?: string) {
    return this.tipsService.findAll(type, ageGroup);
  }

  @Post()
  async createTip(@Body() body: any) {
    return this.tipsService.create(body);
  }
}

import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TipsService } from './tips.service';

@Controller('tips')
@UseGuards(JwtAuthGuard)
export class TipsController {
  constructor(private readonly tipsService: TipsService) {}

  @Get()
  getTips(@Query('type') type?: string, @Query('ageGroup') ageGroup?: string) {
    return this.tipsService.findAll(type, ageGroup);
  }

  @Post()
  createTip(@Body() body: any) {
    return this.tipsService.create(body);
  }

  @Put(':id')
  updateTip(@Param('id') id: string, @Body() body: any) {
    return this.tipsService.update(+id, body);
  }

  @Delete(':id')
  deleteTip(@Param('id') id: string) {
    return this.tipsService.remove(+id);
  }
}

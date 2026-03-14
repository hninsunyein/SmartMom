import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ChildrenService } from './children.service';

@Controller('children')
@UseGuards(JwtAuthGuard)
export class ChildrenController {
  constructor(private readonly childrenService: ChildrenService) {}

  @Get()
  async getMyChildren(@Request() req) {
    return this.childrenService.findByParent(req.user.id);
  }

  @Post()
  async createChild(@Request() req, @Body() body: any) {
    return this.childrenService.create(req.user.id, body);
  }

  @Get(':id')
  async getChild(@Request() req, @Param('id') id: string) {
    return this.childrenService.findOne(+id, req.user.id);
  }

  @Put(':id')
  async updateChild(@Request() req, @Param('id') id: string, @Body() body: any) {
    return this.childrenService.update(+id, req.user.id, body);
  }

  @Delete(':id')
  async deleteChild(@Request() req, @Param('id') id: string) {
    return this.childrenService.remove(+id, req.user.id);
  }
}

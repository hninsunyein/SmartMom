import { Controller, Get, Put, Delete, Param, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdvisorsService } from './advisors.service';

@Controller('advisors')
@UseGuards(JwtAuthGuard)
export class AdvisorsController {
  constructor(private readonly advisorsService: AdvisorsService) {}

  @Get()
  async getApprovedAdvisors() {
    return this.advisorsService.findApproved();
  }

  @Get('all')
  async getAllAdvisors() {
    return this.advisorsService.findAll();
  }

  @Get('pending')
  async getPendingAdvisors(@Request() req) {
    return this.advisorsService.findPending();
  }

  @Get(':id')
  async getAdvisor(@Param('id') id: string) {
    return this.advisorsService.findOne(+id);
  }

  @Put(':id/approve')
  async approveAdvisor(@Param('id') id: string) {
    return this.advisorsService.updateApprovalStatus(+id, 'approved');
  }

  @Put(':id/reject')
  async rejectAdvisor(@Param('id') id: string) {
    return this.advisorsService.updateApprovalStatus(+id, 'rejected');
  }

  @Delete(':id')
  async deleteAdvisor(@Param('id') id: string) {
    return this.advisorsService.remove(+id);
  }
}

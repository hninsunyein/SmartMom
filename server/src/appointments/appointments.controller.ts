import { Controller, Get, Post, Put, Body, Param, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AppointmentsService } from './appointments.service';

@Controller('appointments')
@UseGuards(JwtAuthGuard)
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Get()
  async getMyAppointments(@Request() req) {
    return this.appointmentsService.findByUser(req.user.id, req.user.userType);
  }

  @Post()
  async createAppointment(@Request() req, @Body() body: any) {
    return this.appointmentsService.create({ ...body, parentId: req.user.id });
  }

  @Put(':id/approve')
  async approveAppointment(@Request() req, @Param('id') id: string) {
    return this.appointmentsService.updateStatus(+id, req.user.id, 'confirmed');
  }

  @Put(':id/reject')
  async rejectAppointment(@Request() req, @Param('id') id: string) {
    return this.appointmentsService.updateStatus(+id, req.user.id, 'rejected');
  }

  @Put(':id/cancel')
  async cancelAppointment(@Request() req, @Param('id') id: string) {
    return this.appointmentsService.cancelByParent(+id, req.user.id);
  }
}

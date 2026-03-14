import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Appointment, AppointmentStatus } from '../database/entities/appointment.entity';

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(Appointment)
    private appointmentRepository: Repository<Appointment>,
  ) {}

  async findByUser(userId: number, userType: string) {
    const where = userType === 'parent' ? { parentId: userId } : { advisorId: userId };
    const appointments = await this.appointmentRepository.find({
      where,
      relations: ['parent', 'advisor', 'child'],
      order: { appointmentDate: 'DESC' },
    });
    return { success: true, data: appointments };
  }

  async create(data: any) {
    const appointment = this.appointmentRepository.create({
      ...data,
      status: AppointmentStatus.PENDING,
    });
    const saved = await this.appointmentRepository.save(appointment);
    return { success: true, data: saved };
  }

  async updateStatus(id: number, advisorId: number, status: string) {
    const appt = await this.appointmentRepository.findOne({ where: { id } });
    if (!appt) throw new NotFoundException('Appointment not found');
    if (appt.advisorId !== advisorId) throw new ForbiddenException('Access denied');
    appt.status = status as AppointmentStatus;
    const saved = await this.appointmentRepository.save(appt);
    return { success: true, data: saved };
  }

  async cancelByParent(id: number, parentId: number) {
    const appt = await this.appointmentRepository.findOne({ where: { id } });
    if (!appt) throw new NotFoundException('Appointment not found');
    if (appt.parentId !== parentId) throw new ForbiddenException('Access denied');
    appt.status = AppointmentStatus.CANCELLED;
    const saved = await this.appointmentRepository.save(appt);
    return { success: true, data: saved };
  }
}

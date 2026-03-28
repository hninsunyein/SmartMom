import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserType, ApprovalStatus } from '../database/entities/user.entity';
import { AdvisorAvailability } from '../database/entities/advisor-availability.entity';
import { Appointment } from '../database/entities/appointment.entity';

@Injectable()
export class AdvisorsService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(AdvisorAvailability)
    private availabilityRepository: Repository<AdvisorAvailability>,
    @InjectRepository(Appointment)
    private appointmentRepository: Repository<Appointment>,
  ) {}

  async findApproved() {
    const advisors = await this.userRepository.find({
      where: { userType: UserType.ADVISOR, approvalStatus: ApprovalStatus.APPROVED },
      select: ['id', 'fullName', 'specialty', 'phone', 'experienceYears'],
    });
    const result = await Promise.all(
      advisors.map(async (a) => ({
        ...a,
        availability: await this.availabilityRepository.find({ where: { advisorId: a.id } }),
      }))
    );
    return { success: true, data: result };
  }

  async findPending() {
    const advisors = await this.userRepository.find({
      where: { userType: UserType.ADVISOR, approvalStatus: ApprovalStatus.PENDING },
      select: ['id', 'fullName', 'specialty', 'phone', 'licenseNumber', 'experienceYears', 'approvalStatus'],
    });
    const result = await Promise.all(
      advisors.map(async (a) => ({
        ...a,
        availability: await this.availabilityRepository.find({ where: { advisorId: a.id } }),
      }))
    );
    return { success: true, data: result };
  }

  async findOne(id: number) {
    const advisor = await this.userRepository.findOne({
      where: { id, userType: UserType.ADVISOR },
      select: ['id', 'fullName', 'specialty', 'phone', 'experienceYears', 'approvalStatus'],
    });
    if (!advisor) throw new NotFoundException('Advisor not found');
    const availability = await this.availabilityRepository.find({ where: { advisorId: id } });
    return { success: true, data: { ...advisor, availability } };
  }

  async findAll() {
    const advisors = await this.userRepository.find({
      where: { userType: UserType.ADVISOR },
      select: ['id', 'fullName', 'email', 'specialty', 'phone', 'licenseNumber', 'experienceYears', 'approvalStatus'],
      order: { approvalStatus: 'ASC' },
    });
    const result = await Promise.all(
      advisors.map(async (a) => ({
        ...a,
        availability: await this.availabilityRepository.find({ where: { advisorId: a.id } }),
      }))
    );
    return { success: true, data: result };
  }

  async updateApprovalStatus(id: number, status: string) {
    await this.userRepository.update(id, { approvalStatus: status as ApprovalStatus });
    return { success: true, message: `Advisor ${status}` };
  }

  async remove(id: number) {
    const advisor = await this.userRepository.findOne({ where: { id, userType: UserType.ADVISOR } });
    if (!advisor) throw new NotFoundException('Advisor not found');
    // Delete child rows in dependency order before removing the user
    await this.availabilityRepository.delete({ advisorId: id });
    await this.appointmentRepository.delete({ advisorId: id });
    await this.userRepository.remove(advisor);
    return { success: true, message: 'Advisor deleted' };
  }
}

import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan } from 'typeorm';
import { User, UserType, ApprovalStatus, PlanType } from '../database/entities/user.entity';
import { AdvisorAvailability } from '../database/entities/advisor-availability.entity';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(AdvisorAvailability)
    private availabilityRepository: Repository<AdvisorAvailability>,
  ) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  async findById(id: number): Promise<User | null> {
    return this.userRepository.findOne({ 
      where: { id },
      select: ['id', 'email', 'fullName', 'userType', 'age', 'phone', 'specialty', 'approvalStatus', 'planType']
    });
  }

  async createParent(userData: {
    email: string;
    password: string;
    fullName: string;
    age: number;
    phone:string;
  }): Promise<User> {
    const existingUser = await this.findByEmail(userData.email);
    if (existingUser) {
      throw new ConflictException('Email already registered');
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);

    const user = this.userRepository.create({
      ...userData,
      password: hashedPassword,
      userType: UserType.PARENT,
      approvalStatus: ApprovalStatus.APPROVED,
      planType: PlanType.FREE,
    });

    return this.userRepository.save(user);
  }

  async createAdvisor(userData: {
    email: string;
    password: string;
    fullName: string;
    specialty: string;
    phone: string;
    licenseNumber: string;
    experienceYears: number;
    availability: Array<{
      dayOfWeek: string;
      startTime: string;
      endTime: string;
    }>;
  }): Promise<User> {
    const existingUser = await this.findByEmail(userData.email);
    if (existingUser) {
      throw new ConflictException('Email already registered');
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);

    const user = this.userRepository.create({
      email: userData.email,
      password: hashedPassword,
      fullName: userData.fullName,
      specialty: userData.specialty,
      phone: userData.phone,
      licenseNumber: userData.licenseNumber,
      experienceYears: userData.experienceYears,
      userType: UserType.ADVISOR,
      approvalStatus: ApprovalStatus.PENDING,
    });

    const savedUser = await this.userRepository.save(user);

    if (userData.availability && userData.availability.length > 0) {
      const availabilityRecords = userData.availability.map(slot =>
        this.availabilityRepository.create({
          advisorId: savedUser.id,
          dayOfWeek: slot.dayOfWeek as any,
          startTime: slot.startTime,
          endTime: slot.endTime,
        })
      );
      await this.availabilityRepository.save(availabilityRecords);
    }

    return savedUser;
  }

  async validatePassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  async setPasswordResetToken(userId: number, token: string, expires: Date): Promise<void> {
    await this.userRepository.update(userId, {
      passwordResetToken: token,
      passwordResetExpires: expires,
    });
  }

  async findByResetToken(hashedToken: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: {
        passwordResetToken: hashedToken,
        passwordResetExpires: MoreThan(new Date()),
      },
    });
  }

  async updatePassword(userId: number, hashedPassword: string): Promise<void> {
    await this.userRepository.update(userId, {
      password: hashedPassword,
      passwordResetToken: null,
      passwordResetExpires: null,
    });
  }

  async setRefreshToken(userId: number, hashedToken: string): Promise<void> {
    await this.userRepository.update(userId, { refreshToken: hashedToken });
  }

  async findByRefreshToken(hashedToken: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { refreshToken: hashedToken } });
  }

  async clearRefreshToken(userId: number): Promise<void> {
    await this.userRepository.update(userId, { refreshToken: null });
  }

  async upgradePlan(userId: number): Promise<User> {
    await this.userRepository.update(userId, { planType: PlanType.PREMIUM });
    return this.userRepository.findOne({ where: { id: userId } });
  }

  async findApprovedAdvisors(): Promise<User[]> {
    return this.userRepository.find({
      where: {
        userType: UserType.ADVISOR,
        approvalStatus: ApprovalStatus.APPROVED,
      },
      select: ['id', 'fullName', 'specialty', 'phone'],
    });
  }
}
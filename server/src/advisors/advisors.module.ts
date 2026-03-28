import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../database/entities/user.entity';
import { AdvisorAvailability } from '../database/entities/advisor-availability.entity';
import { Appointment } from '../database/entities/appointment.entity';
import { AdvisorsController } from './advisors.controller';
import { AdvisorsService } from './advisors.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, AdvisorAvailability, Appointment])],
  controllers: [AdvisorsController],
  providers: [AdvisorsService],
  exports: [AdvisorsService],
})
export class AdvisorsModule {}

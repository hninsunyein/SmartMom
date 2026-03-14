import { Controller, Get, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserType } from '../database/entities/user.entity';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('advisors')
  @UseGuards(RolesGuard)
  @Roles(UserType.PARENT)
  async getApprovedAdvisors() {
    const advisors = await this.usersService.findApprovedAdvisors();
    return {
      success: true,
      data: advisors,
    };
  }
}
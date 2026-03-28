import { Injectable, UnauthorizedException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import * as bcrypt from 'bcryptjs';
import { UsersService } from '../users/users.service';
import { User, UserType, ApprovalStatus, PlanType } from '../database/entities/user.entity';
import { RegisterParentDto } from './dto/register-parent.dto';
import { RegisterAdvisorDto } from './dto/register-advisor.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  private signAccessToken(payload: object): string {
    return this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_SECRET'),
      expiresIn: this.configService.get<string>('JWT_ACCESS_EXPIRES_IN') || '15m',
    });
  }

  private signRefreshToken(payload: object): string {
    return this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRES_IN') || '7d',
    });
  }

  private hashToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
  }

  private async generateTokenPair(user: User) {
    const payload = { email: user.email, sub: user.id, userType: user.userType };
    const accessToken = this.signAccessToken(payload);
    const refreshToken = this.signRefreshToken(payload);
    await this.usersService.setRefreshToken(user.id, this.hashToken(refreshToken));
    return { accessToken, refreshToken };
  }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isPasswordValid = await this.usersService.validatePassword(password, user.password);
    
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // Advisors must be approved; admins and parents can always log in
    if (user.userType === UserType.ADVISOR && user.approvalStatus !== ApprovalStatus.APPROVED) {
      throw new ForbiddenException('Your advisor account is pending approval. Please wait for admin review.');
    }

    const { password: _, ...result } = user;
    return result;
  }

  async login(user: User) {
    const { accessToken, refreshToken } = await this.generateTokenPair(user);

    return {
      success: true,
      message: 'Login successful',
      token: accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        userType: user.userType,
        age: user.age,
        phone: user.phone,
        specialty: user.specialty,
        approvalStatus: user.approvalStatus,
        planType: user.planType,
      },
    };
  }

  async refresh(refreshToken: string) {
    let payload: any;
    try {
      payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      });
    } catch {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    const hashed = this.hashToken(refreshToken);
    const user = await this.usersService.findByRefreshToken(hashed);
    if (!user) {
      throw new UnauthorizedException('Refresh token has been revoked');
    }

    const newPayload = { email: user.email, sub: user.id, userType: user.userType };
    const newAccessToken = this.signAccessToken(newPayload);
    const newRefreshToken = this.signRefreshToken(newPayload);
    await this.usersService.setRefreshToken(user.id, this.hashToken(newRefreshToken));

    return { success: true, token: newAccessToken, refreshToken: newRefreshToken };
  }

  async logout(userId: number) {
    await this.usersService.clearRefreshToken(userId);
    return { success: true, message: 'Logged out successfully' };
  }

  async registerParent(registerParentDto: RegisterParentDto) {
    const user = await this.usersService.createParent(registerParentDto);
    const { accessToken, refreshToken } = await this.generateTokenPair(user);

    return {
      success: true,
      message: 'Parent registered successfully',
      token: accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        userType: user.userType,
        age: user.age,
        phone: user.phone,
        planType: user.planType,
      },
    };
  }

  async registerAdvisor(registerAdvisorDto: RegisterAdvisorDto) {
    const user = await this.usersService.createAdvisor(registerAdvisorDto);

    return {
      success: true,
      message: 'Advisor registration submitted for approval',
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        userType: user.userType,
        specialty: user.specialty,
        approvalStatus: user.approvalStatus,
      },
    };
  }

  async getProfile(userId: number) {
    const user = await this.usersService.findById(userId);

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return {
      success: true,
      user,
    };
  }

  async forgotPassword(email: string) {
    const user = await this.usersService.findByEmail(email);

    // Always return success to prevent email enumeration attacks
    if (!user) {
      return {
        success: true,
        message: 'If this email exists, a reset link has been sent.',
      };
    }

    // Generate a random plain token (sent to user) and store its hash in DB
    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    // Token expires in 1 hour
    const expires = new Date(Date.now() + 60 * 60 * 1000);

    await this.usersService.setPasswordResetToken(user.id, hashedToken, expires);

    // In development: log the reset link so you can test without email setup
    const resetUrl = `http://localhost:3000/reset-password?token=${resetToken}`;
    console.log(`\n--- PASSWORD RESET ---`);
    console.log(`Email: ${email}`);
    console.log(`Reset URL: ${resetUrl}`);
    console.log(`Token expires in: 1 hour`);
    console.log(`----------------------\n`);

    return {
      success: true,
      message: 'If this email exists, a reset link has been sent.',
      // Only expose token in development for easy testing
      ...(process.env.NODE_ENV === 'development' && { resetToken, resetUrl }),
    };
  }

  async resetPassword(token: string, newPassword: string) {
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await this.usersService.findByResetToken(hashedToken);

    if (!user) {
      throw new BadRequestException('Reset token is invalid or has expired');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this.usersService.updatePassword(user.id, hashedPassword);

    return {
      success: true,
      message: 'Password has been reset successfully. You can now sign in with your new password.',
    };
  }

  async upgradePlan(userId: number) {
    const user = await this.usersService.findById(userId);

    if (!user) throw new UnauthorizedException('User not found');
    if (user.userType !== UserType.PARENT) {
      throw new ForbiddenException('Plan upgrades are only available for parent accounts');
    }
    if (user.planType === PlanType.PREMIUM) {
      return { success: true, message: 'You are already on the Premium plan', user };
    }

    const upgraded = await this.usersService.upgradePlan(userId);

    return {
      success: true,
      message: 'Upgraded to Premium successfully!',
      user: {
        id: upgraded.id,
        email: upgraded.email,
        fullName: upgraded.fullName,
        userType: upgraded.userType,
        age: upgraded.age,
        phone: upgraded.phone,
        planType: upgraded.planType,
      },
    };
  }
}
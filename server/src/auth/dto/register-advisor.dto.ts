import { IsEmail, IsNotEmpty, IsString, Matches, MinLength, IsPhoneNumber, IsNumber, IsArray, ValidateNested, IsEnum, Min } from 'class-validator';
import { Type } from 'class-transformer';

export enum DayOfWeek {
  MONDAY = 'monday',
  TUESDAY = 'tuesday',
  WEDNESDAY = 'wednesday',
  THURSDAY = 'thursday',
  FRIDAY = 'friday',
  SATURDAY = 'saturday',
  SUNDAY = 'sunday',
}

export class AvailabilitySlotDto {
  @IsEnum(DayOfWeek, { message: 'Invalid day of week' })
  dayOfWeek: DayOfWeek;

  @IsNotEmpty({ message: 'Start time is required' })
  @IsString()
  startTime: string;

  @IsNotEmpty({ message: 'End time is required' })
  @IsString()
  endTime: string;
}

export class RegisterAdvisorDto {
  @IsEmail({}, { message: 'Please provide a valid email address' })
  email: string;

  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
    message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number',
  })
  password: string;

  @IsNotEmpty({ message: 'Full name is required' })
  @IsString()
  @MinLength(2, { message: 'Full name must be at least 2 characters long' })
  fullName: string;

  @IsNotEmpty({ message: 'Specialty is required' })
  @IsString()
  @MinLength(2, { message: 'Specialty must be at least 2 characters long' })
  specialty: string;

  @IsNotEmpty({ message: 'Phone number is required' })
  @IsString()
  phone: string;

  @IsNotEmpty({ message: 'License number is required' })
  @IsString()
  @MinLength(2, { message: 'License number must be at least 2 characters long' })
  licenseNumber: string;

  @IsNotEmpty({ message: 'Experience years is required' })
  @IsNumber({}, { message: 'Experience years must be a number' })
  @Min(0, { message: 'Experience years must be at least 0' })
  experienceYears: number;

  @IsArray({ message: 'Availability must be an array' })
  @ValidateNested({ each: true })
  @Type(() => AvailabilitySlotDto)
  availability: AvailabilitySlotDto[];
}
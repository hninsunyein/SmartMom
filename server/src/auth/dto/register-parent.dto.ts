import { IsEmail, IsNotEmpty, IsString, IsInt, Min, Max, Matches, MinLength } from 'class-validator';

export class RegisterParentDto {
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

  @IsInt({ message: 'Age must be a valid number' })
  @Min(25, { message: 'Age must be at least 25' })
  @Max(42, { message: 'Age must be at most 42' })
  age: number;
}
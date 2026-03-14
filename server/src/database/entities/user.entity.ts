import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Exclude } from 'class-transformer';
import { Child } from './child.entity';

export enum UserType {
  PARENT = 'parent',
  ADVISOR = 'advisor',
  ADMIN = 'admin',
}

export enum ApprovalStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Exclude()
  @Column()
  password: string;

  @Column({ name: 'full_name' })
  fullName: string;

  @Column({
    type: 'enum',
    enum: UserType,
    name: 'user_type',
  })
  userType: UserType;

  @Column({ nullable: true })
  age: number;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  specialty: string;

  @Column({ nullable: true, name: 'license_number' })
  licenseNumber: string;

  @Column({ nullable: true, name: 'experience_years' })
  experienceYears: number;

  @Column({
    type: 'enum',
    enum: ApprovalStatus,
    default: ApprovalStatus.PENDING,
    name: 'approval_status',
  })
  approvalStatus: ApprovalStatus;

  @Exclude()
  @Column({ nullable: true, name: 'password_reset_token' })
  passwordResetToken: string;

  @Exclude()
  @Column({ nullable: true, name: 'password_reset_expires', type: 'datetime' })
  passwordResetExpires: Date;

  @Exclude()
  @Column({ nullable: true, name: 'refresh_token' })
  refreshToken: string;

  @OneToMany(() => Child, (child) => child.parent)
  children: Child[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
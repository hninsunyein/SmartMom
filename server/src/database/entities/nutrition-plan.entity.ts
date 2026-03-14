import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Child } from './child.entity';

export enum NutritionGoal {
  WEIGHT_GAIN = 'weight_gain',
  HEIGHT_GROWTH = 'height_growth',
  IMMUNITY_BOOST = 'immunity_boost',
}

export enum AgeGroup {
  INFANT = '0-2',
  TODDLER = '3-5',
  SCHOOL = '6-12',
  TEEN = '13-18',
}

@Entity('nutrition_plans')
export class NutritionPlan {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'child_id' })
  childId: number;

  @Column({ type: 'date', name: 'plan_date' })
  planDate: Date;

  @Column({ name: 'age_group', nullable: true })
  ageGroup: string;

  @Column({ type: 'simple-array', nullable: true })
  goals: string[];

  @Column({ type: 'text', nullable: true })
  breakfast: string;

  @Column({ type: 'text', nullable: true })
  lunch: string;

  @Column({ type: 'text', nullable: true })
  dinner: string;

  @Column({ type: 'text', nullable: true })
  snacks: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @ManyToOne(() => Child, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'child_id' })
  child: Child;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

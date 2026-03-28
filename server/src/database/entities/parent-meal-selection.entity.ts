import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { SelectedMealPlanItem } from './selected-meal-plan-item.entity';

@Entity('parent_meal_selections')
export class ParentMealSelection {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'parent_id' })
  parentId: number;

  @Column({ name: 'child_id' })
  childId: number;

  @Column({ name: 'age_group', length: 20 })
  ageGroup: string;

  @Column({ name: 'nutrition_goal', length: 200 })
  nutritionGoal: string; // comma-separated goals

  @Column({
    name: 'plan_version',
    type: 'enum',
    enum: ['free', 'premium'],
    default: 'free',
  })
  planVersion: 'free' | 'premium';

  @Column({
    name: 'bmi_value',
    type: 'decimal',
    precision: 5,
    scale: 2,
    nullable: true,
  })
  bmiValue: number;

  @CreateDateColumn({ name: 'generated_date' })
  generatedDate: Date;

  @Column({ name: 'is_active', type: 'tinyint', default: 1 })
  isActive: number;

  @OneToMany(() => SelectedMealPlanItem, (item) => item.selection, {
    cascade: true,
    eager: false,
  })
  items: SelectedMealPlanItem[];
}

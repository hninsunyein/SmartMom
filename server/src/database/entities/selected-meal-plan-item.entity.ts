import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ParentMealSelection } from './parent-meal-selection.entity';

@Entity('selected_meal_plan_items')
export class SelectedMealPlanItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'selection_id' })
  selectionId: number;

  @Column({ name: 'meal_plan_id', type: 'text' })
  mealPlanId: string; // meal content string, e.g. "Rice + Grilled chicken + Salad"

  @Column({ name: 'week_number', default: 1 })
  weekNumber: number;

  @Column({ name: 'day_number', default: 1 })
  dayNumber: number;

  @Column({
    name: 'meal_time',
    type: 'enum',
    enum: ['breakfast', 'lunch', 'dinner'],
  })
  mealTime: 'breakfast' | 'lunch' | 'dinner';

  @ManyToOne(() => ParentMealSelection, (selection) => selection.items, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'selection_id' })
  selection: ParentMealSelection;
}

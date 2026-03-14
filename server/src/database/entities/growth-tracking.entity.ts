import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Child } from './child.entity';

@Entity('growth_tracking')
export class GrowthTracking {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'child_id' })
  childId: number;

  @Column({ type: 'date', name: 'measurement_date' })
  measurementDate: Date;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  height: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  weight: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  bmi: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true, name: 'head_circumference' })
  headCircumference: number;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @ManyToOne(() => Child, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'child_id' })
  child: Child;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}

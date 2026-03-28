import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Child } from '../database/entities/child.entity';
import { User } from '../database/entities/user.entity';
import { GrowthTracking } from '../database/entities/growth-tracking.entity';
import { ChildrenController } from './children.controller';
import { ChildrenService } from './children.service';

@Module({
  imports: [TypeOrmModule.forFeature([Child, User, GrowthTracking])],
  controllers: [ChildrenController],
  providers: [ChildrenService],
  exports: [ChildrenService],
})
export class ChildrenModule {}

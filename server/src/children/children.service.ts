import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Child } from '../database/entities/child.entity';
import { User, PlanType } from '../database/entities/user.entity';
import { GrowthTracking } from '../database/entities/growth-tracking.entity';

const FREE_PLAN_CHILD_LIMIT = 1;

@Injectable()
export class ChildrenService {
  constructor(
    @InjectRepository(Child)
    private childRepository: Repository<Child>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(GrowthTracking)
    private growthRepository: Repository<GrowthTracking>,
  ) {}

  async findByParent(parentId: number) {
    // Get all children for this parent
    const children = await this.childRepository.find({ where: { parentId } });

    // For each child, get the latest growth record
    const childrenWithGrowth = await Promise.all(
      children.map(async (child) => {
        const latestGrowth = await this.growthRepository.findOne({
          where: { childId: child.id },
          order: { measurementDate: 'DESC', createdAt: 'DESC' },
        });

        return {
          ...child,
          weight: latestGrowth?.weight ?? null,
          height: latestGrowth?.height ?? null,
          bmi: latestGrowth?.bmi ?? null,
        };
      }),
    );

    return { success: true, data: childrenWithGrowth };
  }

  async findOne(id: number, parentId: number) {
    const child = await this.childRepository.findOne({ where: { id } });
    if (!child) throw new NotFoundException('Child not found');
    if (child.parentId !== parentId) throw new ForbiddenException('Access denied');

    const latestGrowth = await this.growthRepository.findOne({
      where: { childId: id },
      order: { measurementDate: 'DESC', createdAt: 'DESC' },
    });

    return {
      success: true,
      data: {
        ...child,
        weight: latestGrowth?.weight ?? null,
        height: latestGrowth?.height ?? null,
        bmi: latestGrowth?.bmi ?? null,
      },
    };
  }

  async create(parentId: number, data: any) {
    const parent = await this.userRepository.findOne({ where: { id: parentId }, select: ['id', 'planType'] });
    if (parent?.planType === PlanType.FREE) {
      const count = await this.childRepository.count({ where: { parentId } });
      if (count >= FREE_PLAN_CHILD_LIMIT) {
        throw new ForbiddenException(
          'Free plan allows only 1 child profile. Upgrade to Premium to add multiple profiles.',
        );
      }
    }

    const { weight, height, ...childData } = data;
    const child = this.childRepository.create({ ...childData, parentId });
    const saved = await this.childRepository.save(child) as unknown as Child;

    // Save initial growth record if weight or height is provided
    if (weight || height) {
      let bmi: number | null = null;
      if (weight && height && Number(height) > 0) {
        const heightM = Number(height) / 100;
        bmi = Math.round((Number(weight) / (heightM * heightM)) * 100) / 100;
      }

      await this.growthRepository.save({
        childId: saved.id,
        weight: weight ? Number(weight) : null,
        height: height ? Number(height) : null,
        bmi,
        measurementDate: new Date(),
      });
    }

    return {
      success: true,
      data: {
        ...saved,
        weight: weight ? Number(weight) : null,
        height: height ? Number(height) : null,
        bmi: (() => {
          if (weight && height && Number(height) > 0) {
            const heightM = Number(height) / 100;
            return Math.round((Number(weight) / (heightM * heightM)) * 100) / 100;
          }
          return null;
        })(),
      },
    };
  }

  async update(id: number, parentId: number, data: any) {
    const child = await this.childRepository.findOne({ where: { id } });
    if (!child) throw new NotFoundException('Child not found');
    if (child.parentId !== parentId) throw new ForbiddenException('Access denied');

    const { weight, height, ...childData } = data;
    Object.assign(child, childData);
    const saved = await this.childRepository.save(child);

    // If weight or height is being updated, save a new growth record
    if (weight || height) {
      let bmi: number | null = null;
      if (weight && height && Number(height) > 0) {
        const heightM = Number(height) / 100;
        bmi = Math.round((Number(weight) / (heightM * heightM)) * 100) / 100;
      }

      await this.growthRepository.save({
        childId: id,
        weight: weight ? Number(weight) : null,
        height: height ? Number(height) : null,
        bmi,
        measurementDate: new Date(),
      });
    }

    const latestGrowth = await this.growthRepository.findOne({
      where: { childId: id },
      order: { measurementDate: 'DESC', createdAt: 'DESC' },
    });

    return {
      success: true,
      data: {
        ...saved,
        weight: latestGrowth?.weight ?? null,
        height: latestGrowth?.height ?? null,
        bmi: latestGrowth?.bmi ?? null,
      },
    };
  }

  async remove(id: number, parentId: number) {
    const child = await this.childRepository.findOne({ where: { id } });
    if (!child) throw new NotFoundException('Child not found');
    if (child.parentId !== parentId) throw new ForbiddenException('Access denied');
    await this.childRepository.remove(child);
    return { success: true, message: 'Child deleted' };
  }

  async findById(id: number): Promise<Child | null> {
    return this.childRepository.findOne({ where: { id } });
  }
}

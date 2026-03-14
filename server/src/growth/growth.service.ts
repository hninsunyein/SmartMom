import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GrowthTracking } from '../database/entities/growth-tracking.entity';

@Injectable()
export class GrowthService {
  constructor(
    @InjectRepository(GrowthTracking)
    private growthRepository: Repository<GrowthTracking>,
  ) {}

  async findByChild(childId: number) {
    const records = await this.growthRepository.find({
      where: { childId },
      order: { measurementDate: 'ASC' },
    });
    return { success: true, data: records };
  }

  async create(data: any) {
    if (data.weight && data.height) {
      const heightM = data.height / 100;
      data.bmi = parseFloat((data.weight / (heightM * heightM)).toFixed(2));
    }
    const record = this.growthRepository.create(data);
    const saved = await this.growthRepository.save(record);
    return { success: true, data: saved };
  }
}

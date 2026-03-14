import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tip } from '../database/entities/tip.entity';

@Injectable()
export class TipsService {
  constructor(
    @InjectRepository(Tip)
    private tipRepository: Repository<Tip>,
  ) {}

  async findAll(type?: string, ageGroup?: string) {
    const where: any = {};
    if (type) where.type = type;
    if (ageGroup) where.ageGroup = ageGroup;
    const tips = await this.tipRepository.find({ where, order: { createdAt: 'DESC' } });
    return { success: true, data: tips };
  }

  async create(data: any) {
    const tip = this.tipRepository.create(data);
    const saved = await this.tipRepository.save(tip);
    return { success: true, data: saved };
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
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

  async update(id: number, data: any) {
    const tip = await this.tipRepository.findOne({ where: { id } });
    if (!tip) throw new NotFoundException('Tip not found');
    Object.assign(tip, data);
    const saved = await this.tipRepository.save(tip);
    return { success: true, data: saved };
  }

  async remove(id: number) {
    const tip = await this.tipRepository.findOne({ where: { id } });
    if (!tip) throw new NotFoundException('Tip not found');
    await this.tipRepository.remove(tip);
    return { success: true, message: 'Tip deleted' };
  }
}

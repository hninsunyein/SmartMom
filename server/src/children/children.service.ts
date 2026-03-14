import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Child } from '../database/entities/child.entity';

@Injectable()
export class ChildrenService {
  constructor(
    @InjectRepository(Child)
    private childRepository: Repository<Child>,
  ) {}

  async findByParent(parentId: number) {
    const children = await this.childRepository.find({ where: { parentId } });
    return { success: true, data: children };
  }

  async findOne(id: number, parentId: number) {
    const child = await this.childRepository.findOne({ where: { id } });
    if (!child) throw new NotFoundException('Child not found');
    if (child.parentId !== parentId) throw new ForbiddenException('Access denied');
    return { success: true, data: child };
  }

  async create(parentId: number, data: any) {
    const child = this.childRepository.create({ ...data, parentId });
    const saved = await this.childRepository.save(child);
    return { success: true, data: saved };
  }

  async update(id: number, parentId: number, data: any) {
    const child = await this.childRepository.findOne({ where: { id } });
    if (!child) throw new NotFoundException('Child not found');
    if (child.parentId !== parentId) throw new ForbiddenException('Access denied');
    Object.assign(child, data);
    const saved = await this.childRepository.save(child);
    return { success: true, data: saved };
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

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Saving } from 'src/schemas/budget-plan/saving.schema';
import {
  CreateSavingDto,
  UpdateSavingDto,
} from 'src/dtos/budget-plan/saving.dto';

@Injectable()
export class SavingService {
  constructor(
    @InjectModel(Saving.name) private readonly model: Model<Saving>,
  ) {}

  async create(dto: CreateSavingDto) {
    const saving = new this.model(dto);
    return saving.save();
  }

  findAll() {
    return this.model.find().exec();
  }

  async findById(id: string) {
    const saving = await this.model.findById(id).exec();
    if (!saving) throw new NotFoundException('Saving not found');
    return saving;
  }

  async update(id: string, dto: UpdateSavingDto) {
    const updated = await this.model
      .findByIdAndUpdate(id, dto, { new: true })
      .exec();
    if (!updated) throw new NotFoundException('Saving not found');
    return updated;
  }

  async delete(id: string) {
    const deleted = await this.model.findByIdAndDelete(id).exec();
    if (!deleted) throw new NotFoundException('Saving not found');
  }
}

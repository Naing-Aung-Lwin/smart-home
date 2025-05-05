import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { IncomeSource } from 'src/schemas/budget-plan/income-source.schema';
import { Model } from 'mongoose';
import {
  CreateIncomeSourceDto,
  UpdateIncomeSourceDto,
} from 'src/dtos/budget-plan/income.dto';

@Injectable()
export class IncomeSourceService {
  constructor(
    @InjectModel(IncomeSource.name) private model: Model<IncomeSource>,
  ) {}

  async create(dto: CreateIncomeSourceDto) {
    const existing = await this.model.findOne({ name: dto.name }).exec();
    if (existing) {
      return existing;
    }
    const created = new this.model(dto);
    return created.save();
  }

  findAll() {
    return this.model.find().exec();
  }

  async findById(id: string) {
    const source = await this.model.findById(id).exec();
    if (!source) throw new NotFoundException('Income source not found');
    return source;
  }

  async update(id: string, dto: UpdateIncomeSourceDto) {
    const existing = await this.model.findOne({ name: dto.name }).exec();
    if (existing && (existing._id as string).toString() !== id) {
      throw new BadRequestException('Income source already exists');
    }
    const updated = await this.model
      .findByIdAndUpdate(id, dto, { new: true })
      .exec();
    if (!updated) throw new NotFoundException('Income source not found');
    return updated;
  }

  async delete(id: string) {
    const deleted = await this.model.findByIdAndDelete(id).exec();
    if (!deleted) throw new NotFoundException('Income source not found');
  }
}

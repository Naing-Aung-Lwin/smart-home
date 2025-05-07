import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { Curry, CurryDocument } from 'src/schemas/dining-plan/curry.schema';
import { CreateCurryDto } from 'src/dtos/dining-plan/curry/create-curry.dto';
import { UpdateCurryDto } from 'src/dtos/dining-plan/curry/update-curry.dto';
import { SearchCurry } from 'src/dtos/dining-plan/curry/search-curry.dto';

@Injectable()
export class CurryService {
  constructor(
    @InjectModel(Curry.name) private curryModel: Model<CurryDocument>,
  ) {}

  async create(dto: CreateCurryDto): Promise<Curry> {
    const created = new this.curryModel(dto);
    return created.save();
  }

  async findAll(query: SearchCurry): Promise<Curry[]> {
    const andConditions: FilterQuery<Curry> = {};
    if (query.name) {
      andConditions.name = { $regex: query.name, $options: 'i' };
    }
    if (query.type) {
      andConditions.type = query.type;
    }
    return this.curryModel.find(andConditions).exec();
  }

  async findOne(id: string): Promise<Curry | null> {
    const result = await this.curryModel.findById(id).exec();
    if (!result) {
      throw new NotFoundException(`Curry with id ${id} not found`);
    }
    return result;
  }

  async update(id: string, data: UpdateCurryDto): Promise<Curry | null> {
    const result = await this.curryModel
      .findByIdAndUpdate(id, data, { new: true })
      .exec();
    if (!result) {
      throw new NotFoundException(`Curry with id ${id} not found`);
    }
    return result;
  }

  async delete(id: string): Promise<Curry> {
    const result = await this.curryModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Curry with id ${id} not found`);
    }
    return result;
  }
}

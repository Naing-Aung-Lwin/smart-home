import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Menu } from 'src/schemas/dining-plan/menu.schema';
import { FilterQuery, Model, Types } from 'mongoose';
import { UpdateMenuDto } from 'src/dtos/dining-plan/menu/update-menu.dto';
import { CreateMenuDto } from 'src/dtos/dining-plan/menu/create-menu.dto';
import { SearchMenu } from 'src/dtos/dining-plan/menu/search-menu.dto';

@Injectable()
export class MenuService {
  constructor(@InjectModel(Menu.name) private menuModel: Model<Menu>) {}

  async create(data: CreateMenuDto): Promise<Menu> {
    const existingMenu = await this.menuModel.findOne({
      meal: data.meal,
      vegetable: data.vegetable,
    });
    if (existingMenu) {
      return existingMenu;
    }
    return new this.menuModel(data).save();
  }

  findAll(query: SearchMenu): Promise<Menu[]> {
    const andConditions: FilterQuery<Menu> = {};
    if (query.meal) {
      andConditions.meal = new Types.ObjectId(query.meal);
    }
    if (query.vegetable) {
      andConditions.vegetable = new Types.ObjectId(query.vegetable);
    }
    return this.menuModel
      .find(andConditions)
      .populate('meal')
      .populate('vegetable')
      .exec();
  }

  async findOne(id: string): Promise<Menu | null> {
    const result = await this.menuModel
      .findById(id)
      .populate('meal')
      .populate('vegetable')
      .exec();
    if (!result) {
      throw new NotFoundException(`Menu with id ${id} not found`);
    }
    return result;
  }

  async update(id: string, data: UpdateMenuDto): Promise<Menu | null> {
    const existingMenu = await this.menuModel.findOne({
      meal: data.meal,
      vegetable: data.vegetable,
    });
    if (existingMenu) {
      return existingMenu;
    }
    const result = await this.menuModel
      .findByIdAndUpdate(id, data, { new: true })
      .exec();
    if (!result) {
      throw new NotFoundException(`Menu with id ${id} not found`);
    }
    return result;
  }

  async delete(id: string): Promise<Menu | null> {
    const result = await this.menuModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Menu with id ${id} not found`);
    }
    return result;
  }
}

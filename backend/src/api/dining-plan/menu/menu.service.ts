import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Menu } from 'src/schemas/dining-plan/menu.schema';
import { FilterQuery, Model } from 'mongoose';
import { UpdateMenuDto } from 'src/dtos/dining-plan/menu/update-menu.dto';
import { CreateMenuDto } from 'src/dtos/dining-plan/menu/create-menu.dto';
import { SearchMenu } from 'src/dtos/dining-plan/menu/search-menu.dto';
import { Curry } from 'src/schemas/dining-plan/curry.schema';

@Injectable()
export class MenuService {
  constructor(
    @InjectModel(Menu.name) private menuModel: Model<Menu>,
    @InjectModel(Curry.name) private curryModel: Model<Curry>,
  ) {}

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

  async findAll(query: SearchMenu): Promise<Menu[]> {
    const andConditions: FilterQuery<Menu> = {};
    if (query.name) {
      const curries = await this.curryModel
        .find({
          name: { $regex: query.name, $options: 'i' },
        })
        .select('_id')
        .lean();
      const curryIds = curries.map((c) => c._id);
      andConditions.$or = [
        { meal: { $in: curryIds } },
        { vegetable: { $in: curryIds } },
      ];
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

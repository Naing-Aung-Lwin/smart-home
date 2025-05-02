import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Menu } from './schemas/menu.schema';
import { Model } from 'mongoose';
import { MenuIdParam } from './dtos/menu-id.param';
import { UpdateMenuDto } from './dtos/update-menu.dto';

@Injectable()
export class MenuService {
  constructor(@InjectModel(Menu.name) private menuModel: Model<Menu>) {}

  create(data: Partial<Menu>): Promise<Menu> {
    return new this.menuModel(data).save();
  }

  findAll(): Promise<Menu[]> {
    return this.menuModel.find().exec();
  }

  findOne(id: string): Promise<Menu | null> {
    return this.menuModel.findById(id).exec();
  }

  update(id: MenuIdParam, data: UpdateMenuDto): Promise<Menu | null> {
    return this.menuModel.findByIdAndUpdate(id, data, { new: true }).exec();
  }

  delete(id: string): Promise<Menu | null> {
    return this.menuModel.findByIdAndDelete(id).exec();
  }
}

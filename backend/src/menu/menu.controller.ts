import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  BadRequestException,
} from '@nestjs/common';
import { MenuService } from './menu.service';
import { Menu } from './schemas/menu.schema';
import { MenuIdParam } from './dtos/menu-id.param';
import { UpdateMenuDto } from './dtos/update-menu.dto';
import { CreateMenuDto } from './dtos/create-menu.dto';

@Controller('menu')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Get()
  findAll(): Promise<Menu[]> {
    try {
      return this.menuService.findAll();
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Get(':id')
  findOne(@Param() params: MenuIdParam): Promise<Menu | null> {
    try {
      return this.menuService.findOne(params.id);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Post()
  create(@Body() body: CreateMenuDto): Promise<Menu> {
    try {
      return this.menuService.create(body);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Put(':id')
  update(
    @Param() params: MenuIdParam,
    @Body() data: UpdateMenuDto,
  ): Promise<Menu | null> {
    try {
      return this.menuService.update(params.id, data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Delete(':id')
  delete(@Param() params: MenuIdParam): Promise<Menu | null> {
    try {
      return this.menuService.delete(params.id);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}

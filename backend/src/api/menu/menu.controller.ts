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
import { Menu } from 'src/schemas/menu.schema';
import { IdParam } from 'src/dtos/id.param';
import { UpdateMenuDto } from 'src/dtos/menu/update-menu.dto';
import { CreateMenuDto } from 'src/dtos/menu/create-menu.dto';

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
  findOne(@Param() params: IdParam): Promise<Menu | null> {
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
    @Param() params: IdParam,
    @Body() data: UpdateMenuDto,
  ): Promise<Menu | null> {
    try {
      return this.menuService.update(params.id, data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Delete(':id')
  delete(@Param() params: IdParam): Promise<Menu | null> {
    try {
      return this.menuService.delete(params.id);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}

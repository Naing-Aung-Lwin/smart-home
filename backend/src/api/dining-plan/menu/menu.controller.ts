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
import { Menu } from 'src/schemas/dining-plan/menu.schema';
import { IdParam } from 'src/dtos/id.param';
import { UpdateMenuDto } from 'src/dtos/dining-plan/menu/update-menu.dto';
import { CreateMenuDto } from 'src/dtos/dining-plan/menu/create-menu.dto';
import { ApiParam, ApiTags } from '@nestjs/swagger';

@ApiTags('menu')
@Controller('menu')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Post()
  create(@Body() body: CreateMenuDto): Promise<Menu> {
    try {
      return this.menuService.create(body);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Get()
  findAll(): Promise<Menu[]> {
    try {
      return this.menuService.findAll();
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Get(':id')
  @ApiParam({
    name: 'id',
    type: String,
    description: 'Menu ID (MongoDB ObjectId)',
  })
  findOne(@Param() params: IdParam): Promise<Menu | null> {
    try {
      return this.menuService.findOne(params.id);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Put(':id')
  @ApiParam({ name: 'id', type: String, description: 'Menu ID to update' })
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
  @ApiParam({ name: 'id', type: String, description: 'Menu ID to delete' })
  delete(@Param() params: IdParam): Promise<Menu | null> {
    try {
      return this.menuService.delete(params.id);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}

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
import * as CONST from 'src/constants';
import { MenuIdParam } from './dtos/menu-id.param';
import { UpdateMenuDto } from './dtos/update-menu.dto';

@Controller('menu')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  private api_name = 'menu';

  @Get()
  findAll(): Promise<Menu[]> {
    try {
      return this.menuService.findAll();
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Menu | null> {
    try {
      return this.menuService.findOne(id);
    } catch (error) {
      const msg_prefix = `${CONST.FAIL_TO_FETCH} ${this.api_name} id : ${id}}`;
      const msg = (error as Error)?.message
        ? msg_prefix + ' >> ' + (error as Error)?.message
        : msg_prefix;
      throw new BadRequestException(msg);
    }
  }

  @Post()
  create(@Body() body: Partial<Menu>): Promise<Menu> {
    try {
      return this.menuService.create(body);
    } catch (error) {
      console.error('Menu creation error:', error);
      const msg_prefix = `${CONST.FAIL_TO_CREATE} ${this.api_name}`;
      const msg = (error as Error)?.message
        ? msg_prefix + ' >> ' + (error as Error)?.message
        : msg_prefix;
      throw new BadRequestException(msg);
    }
  }

  @Put(':id')
  update(
    @Param('id') id: MenuIdParam,
    @Body() data: UpdateMenuDto,
  ): Promise<Menu | null> {
    try {
      return this.menuService.update(id, data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Delete(':id')
  delete(@Param('id') id: string): Promise<Menu | null> {
    try {
      return this.menuService.delete(id);
    } catch (error) {
      const msg_prefix = `${CONST.FAIL_TO_DELETE} ${this.api_name} id : ${id}`;
      const msg = (error as Error)?.message
        ? msg_prefix + ' >> ' + (error as Error)?.message
        : msg_prefix;
      throw new BadRequestException(msg);
    }
  }
}

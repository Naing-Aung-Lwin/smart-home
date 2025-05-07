import {
  Controller,
  Post,
  Get,
  Body,
  Delete,
  Put,
  Param,
  BadRequestException,
  Query,
} from '@nestjs/common';
import { CurryService } from './curry.service';
import { CreateCurryDto } from 'src/dtos/dining-plan/curry/create-curry.dto';
import { Curry } from 'src/schemas/dining-plan/curry.schema';
import { IdParam } from 'src/dtos/id.param';
import { UpdateCurryDto } from 'src/dtos/dining-plan/curry/update-curry.dto';
import { ApiParam } from '@nestjs/swagger';
import { SearchCurry } from 'src/dtos/dining-plan/curry/search-curry.dto';

@Controller('curry')
export class CurryController {
  constructor(private readonly curryService: CurryService) {}

  @Post()
  async create(@Body() dto: CreateCurryDto): Promise<Curry> {
    try {
      return this.curryService.create(dto);
    } catch (err) {
      throw new BadRequestException(err);
    }
  }

  @Get()
  async findAll(@Query() query: SearchCurry): Promise<Curry[]> {
    try {
      return this.curryService.findAll(query);
    } catch (err) {
      throw new BadRequestException(err);
    }
  }

  @Get(':id')
  @ApiParam({
    name: 'id',
    type: String,
    description: 'Curry ID (MongoDB ObjectId)',
  })
  async findOne(@Param() params: IdParam): Promise<Curry | null> {
    try {
      return this.curryService.findOne(params.id);
    } catch (err) {
      throw new BadRequestException(err);
    }
  }

  @Put(':id')
  @ApiParam({
    name: 'id',
    type: String,
    description: 'Menu ID (MongoDB ObjectId)',
  })
  async update(
    @Param() params: IdParam,
    @Body() dto: UpdateCurryDto,
  ): Promise<Curry | null> {
    try {
      return this.curryService.update(params.id, dto);
    } catch (err) {
      throw new BadRequestException(err);
    }
  }

  @Delete(':id')
  @ApiParam({
    name: 'id',
    type: String,
    description: 'Menu ID (MongoDB ObjectId)',
  })
  async delete(@Param() params: IdParam): Promise<Curry> {
    try {
      return this.curryService.delete(params.id);
    } catch (err) {
      throw new BadRequestException(err);
    }
  }
}

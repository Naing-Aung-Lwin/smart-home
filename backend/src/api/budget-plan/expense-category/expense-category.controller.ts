import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { ExpenseCategoryService } from './expense-category.service';
import {
  CreateExpenseCategoryDto,
  UpdateExpenseCategoryDto,
} from 'src/dtos/budget-plan/expense-category.dto';
import { IdParam } from 'src/dtos/id.param';
import { ApiParam, ApiTags } from '@nestjs/swagger';

@ApiTags('Expense Category')
@Controller('expense-categories')
export class ExpenseCategoryController {
  constructor(private readonly service: ExpenseCategoryService) {}

  @Post()
  create(@Body() dto: CreateExpenseCategoryDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @ApiParam({ name: 'id', description: 'MongoDB ObjectId' })
  findOne(@Param() params: IdParam) {
    return this.service.findOne(params.id);
  }

  @Put(':id')
  @ApiParam({ name: 'id', description: 'MongoDB ObjectId' })
  update(@Param() params: IdParam, @Body() dto: UpdateExpenseCategoryDto) {
    return this.service.update(params.id, dto);
  }

  @Delete(':id')
  @ApiParam({ name: 'id', description: 'MongoDB ObjectId' })
  remove(@Param() params: IdParam) {
    return this.service.remove(params.id);
  }
}

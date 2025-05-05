import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Param,
  Body,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiTags, ApiParam } from '@nestjs/swagger';

import { IncomeService } from './income.service';
import {
  CreateIncomeDto,
  UpdateIncomeDto,
} from 'src/dtos/budget-plan/income.dto';
import { IdParam } from 'src/dtos/id.param';

@ApiTags('Income')
@Controller('income')
export class IncomeController {
  constructor(private readonly incomeService: IncomeService) {}

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  create(@Body() dto: CreateIncomeDto) {
    return this.incomeService.create(dto);
  }

  @Get()
  findAll() {
    return this.incomeService.findAll();
  }

  @Get(':id')
  @ApiParam({ name: 'id', description: 'MongoDB ObjectId' })
  findById(@Param() params: IdParam) {
    return this.incomeService.findById(params.id);
  }

  @Put(':id')
  @ApiParam({ name: 'id', description: 'MongoDB ObjectId' })
  update(@Param() params: IdParam, @Body() dto: UpdateIncomeDto) {
    return this.incomeService.update(params.id, dto);
  }

  @Delete(':id')
  @ApiParam({ name: 'id', description: 'MongoDB ObjectId' })
  delete(@Param() params: IdParam) {
    return this.incomeService.delete(params.id);
  }
}

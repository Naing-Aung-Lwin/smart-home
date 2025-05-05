import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { BudgetService } from './budget.service';
import {
  CreateBudgetDto,
  UpdateBudgetDto,
} from 'src/dtos/budget-plan/budget.dto';
import { IdParam } from 'src/dtos/id.param';
import { ApiTags, ApiParam } from '@nestjs/swagger';

@ApiTags('Budget')
@Controller('budget')
export class BudgetController {
  constructor(private readonly service: BudgetService) {}

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  create(@Body() dto: CreateBudgetDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @ApiParam({ name: 'id', description: 'MongoDB ObjectId' })
  findById(@Param() params: IdParam) {
    return this.service.findById(params.id);
  }

  @Put(':id')
  @ApiParam({ name: 'id', description: 'MongoDB ObjectId' })
  update(@Param() params: IdParam, @Body() dto: UpdateBudgetDto) {
    return this.service.update(params.id, dto);
  }

  @Delete(':id')
  @ApiParam({ name: 'id', description: 'MongoDB ObjectId' })
  delete(@Param() params: IdParam) {
    return this.service.delete(params.id);
  }
}

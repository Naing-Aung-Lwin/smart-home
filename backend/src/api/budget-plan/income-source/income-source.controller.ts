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
import { IncomeSourceService } from './income-source.service';
import {
  CreateIncomeSourceDto,
  UpdateIncomeSourceDto,
} from 'src/dtos/budget-plan/income-source.dto';
import { IdParam } from 'src/dtos/id.param';
import { ApiTags, ApiParam } from '@nestjs/swagger';

@ApiTags('Income Source')
@Controller('income-source')
export class IncomeSourceController {
  constructor(private readonly service: IncomeSourceService) {}

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  create(@Body() dto: CreateIncomeSourceDto) {
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
  update(@Param() params: IdParam, @Body() dto: UpdateIncomeSourceDto) {
    return this.service.update(params.id, dto);
  }

  @Delete(':id')
  @ApiParam({ name: 'id', description: 'MongoDB ObjectId' })
  delete(@Param() params: IdParam) {
    return this.service.delete(params.id);
  }
}

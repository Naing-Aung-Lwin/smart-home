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

import { CashFlowService } from './cash-flow.service';
import {
  CreateCashFlowDto,
  UpdateCashFlowDto,
} from 'src/dtos/budget-plan/cash-flow.dto';
import { IdParam } from 'src/dtos/id.param';

@ApiTags('Cash Flow')
@Controller('cash-flows')
export class CashFlowController {
  constructor(private readonly cashFlowService: CashFlowService) {}

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  create(@Body() dto: CreateCashFlowDto) {
    return this.cashFlowService.create(dto);
  }

  @Get()
  findAll() {
    return this.cashFlowService.findAll();
  }

  @Get(':id')
  @ApiParam({ name: 'id', description: 'MongoDB ObjectId' })
  findById(@Param() params: IdParam) {
    return this.cashFlowService.findById(params.id);
  }

  @Put(':id')
  @ApiParam({ name: 'id', description: 'MongoDB ObjectId' })
  update(@Param() params: IdParam, @Body() dto: UpdateCashFlowDto) {
    return this.cashFlowService.update(params.id, dto);
  }

  @Delete(':id')
  @ApiParam({ name: 'id', description: 'MongoDB ObjectId' })
  delete(@Param() params: IdParam) {
    return this.cashFlowService.delete(params.id);
  }
}

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
  Query,
} from '@nestjs/common';
import { SavingService } from './saving.service';
import {
  CreateSavingDto,
  FilterSavingDto,
  UpdateSavingDto,
} from 'src/dtos/budget-plan/saving.dto';
import { ApiTags, ApiParam } from '@nestjs/swagger';
import { IdParam } from 'src/dtos/id.param';

@ApiTags('Saving')
@Controller('saving')
export class SavingController {
  constructor(private readonly service: SavingService) {}

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  create(@Body() dto: CreateSavingDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll(@Query() query: FilterSavingDto) {
    return this.service.findAll(query);
  }

  @Get(':id')
  @ApiParam({ name: 'id', description: 'MongoDB ObjectId' })
  findById(@Param() params: IdParam) {
    return this.service.findById(params.id);
  }

  @Put(':id')
  @ApiParam({ name: 'id', description: 'MongoDB ObjectId' })
  update(@Param() params: IdParam, @Body() dto: UpdateSavingDto) {
    return this.service.update(params.id, dto);
  }

  @Delete(':id')
  @ApiParam({ name: 'id', description: 'MongoDB ObjectId' })
  delete(@Param() params: IdParam) {
    return this.service.delete(params.id);
  }
}

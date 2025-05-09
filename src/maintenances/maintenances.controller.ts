import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Patch,
  Delete,
  Query,
} from '@nestjs/common';
import { MaintenancesService } from './maintenances.service';
import { Maintenance } from './entities/maintenance.entity';
import { FindMaintenanceDto } from './dtos/find-maintenance.dto';

@Controller('maintenances')
export class MaintenancesController {
  constructor(private readonly maintService: MaintenancesService) {}

  @Get()
  findAll(@Query() query: FindMaintenanceDto) {
    return this.maintService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.maintService.findOne(+id);
  }

  @Post()
  create(@Body() body: any) {
    return this.maintService.create(body);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() data: any) {
    return this.maintService.update(+id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.maintService.remove(+id);
  }
}

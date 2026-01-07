import { Controller, Get, Post, Body, Patch, Param, Delete, Logger } from '@nestjs/common';
import { MonitorsService } from './monitors.service';
import { CreateMonitorDto } from './dto/create-monitor.dto';
import { UpdateMonitorDto } from './dto/update-monitor.dto';

@Controller('monitors')
export class MonitorsController {
  private readonly logger = new Logger(MonitorsController.name);

  constructor(private readonly monitorsService: MonitorsService) { }

  @Post()
  create(@Body() createMonitorDto: CreateMonitorDto) {
    this.logger.log('create called');
    return this.monitorsService.create(createMonitorDto);
  }

  @Get()
  findAll() {
    this.logger.log('findAll called');
    return this.monitorsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    this.logger.log(`findOne called id=${id}`);
    return this.monitorsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMonitorDto: UpdateMonitorDto) {
    this.logger.log(`update called id=${id}`);
    return this.monitorsService.update(+id, updateMonitorDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    this.logger.log(`remove called id=${id}`);
    return this.monitorsService.remove(+id);
  }
}

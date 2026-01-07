import { Controller, Get, Post, Body, Patch, Param, Delete, Logger } from '@nestjs/common';
import { BusinessUnitsService } from './business-units.service';
import { CreateBusinessUnitDto } from './dto/create-business-unit.dto';
import { UpdateBusinessUnitDto } from './dto/update-business-unit.dto';

@Controller('business-units')
export class BusinessUnitsController {
  private readonly logger = new Logger(BusinessUnitsController.name);

  constructor(private readonly businessUnitsService: BusinessUnitsService) { }

  @Post()
  create(@Body() createBusinessUnitDto: CreateBusinessUnitDto) {
    this.logger.log('create called');
    return this.businessUnitsService.create(createBusinessUnitDto);
  }

  @Get()
  findAll() {
    this.logger.log('findAll called');
    return this.businessUnitsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    this.logger.log(`findOne called id=${id}`);
    return this.businessUnitsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBusinessUnitDto: UpdateBusinessUnitDto) {
    this.logger.log(`update called id=${id}`);
    return this.businessUnitsService.update(+id, updateBusinessUnitDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    this.logger.log(`remove called id=${id}`);
    return this.businessUnitsService.remove(+id);
  }
}

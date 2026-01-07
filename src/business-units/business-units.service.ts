import { Injectable, Logger } from '@nestjs/common';
import { CreateBusinessUnitDto } from './dto/create-business-unit.dto';
import { UpdateBusinessUnitDto } from './dto/update-business-unit.dto';

@Injectable()
export class BusinessUnitsService {
  private readonly logger = new Logger(BusinessUnitsService.name);
  create(createBusinessUnitDto: CreateBusinessUnitDto) {
    this.logger.log('create called');
    return 'This action adds a new businessUnit';
  }

  findAll() {
    this.logger.log('findAll called');
    return `This action returns all businessUnits`;
  }

  findOne(id: number) {
    this.logger.log(`findOne called id=${id}`);
    return `This action returns a #${id} businessUnit`;
  }

  update(id: number, updateBusinessUnitDto: UpdateBusinessUnitDto) {
    this.logger.log(`update called id=${id}`);
    return `This action updates a #${id} businessUnit`;
  }

  remove(id: number) {
    this.logger.log(`remove called id=${id}`);
    return `This action removes a #${id} businessUnit`;
  }
}

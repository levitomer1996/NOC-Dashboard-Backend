import { Injectable, Logger } from '@nestjs/common';
import { CreateMonitorDto } from './dto/create-monitor.dto';
import { UpdateMonitorDto } from './dto/update-monitor.dto';

@Injectable()
export class MonitorsService {
  private readonly logger = new Logger(MonitorsService.name);
  create(createMonitorDto: CreateMonitorDto) {
    this.logger.log('create called');
    return 'This action adds a new monitor';
  }

  findAll() {
    this.logger.log('findAll called');
    return `This action returns all monitors`;
  }

  findOne(id: number) {
    this.logger.log(`findOne called id=${id}`);
    return `This action returns a #${id} monitor`;
  }

  update(id: number, updateMonitorDto: UpdateMonitorDto) {
    this.logger.log(`update called id=${id}`);
    return `This action updates a #${id} monitor`;
  }

  remove(id: number) {
    this.logger.log(`remove called id=${id}`);
    return `This action removes a #${id} monitor`;
  }
}

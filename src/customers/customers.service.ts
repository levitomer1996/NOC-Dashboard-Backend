import { Injectable, Logger } from '@nestjs/common';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';

@Injectable()
export class CustomersService {
  private readonly logger = new Logger(CustomersService.name);
  create(createCustomerDto: CreateCustomerDto) {
    this.logger.log('create called');
    return 'This action adds a new customer';
  }

  findAll() {
    this.logger.log('findAll called');
    return `This action returns all customers`;
  }

  findOne(id: number) {
    this.logger.log(`findOne called id=${id}`);
    return `This action returns a #${id} customer`;
  }

  update(id: number, updateCustomerDto: UpdateCustomerDto) {
    this.logger.log(`update called id=${id}`);
    return `This action updates a #${id} customer`;
  }

  remove(id: number) {
    this.logger.log(`remove called id=${id}`);
    return `This action removes a #${id} customer`;
  }
}

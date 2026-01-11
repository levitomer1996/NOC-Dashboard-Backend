import { Injectable, Logger, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { Customer, CustomerDocument } from './schemas/customer.schema';

@Injectable()
export class CustomersService {
  private readonly logger = new Logger(CustomersService.name);
  constructor(
    @InjectModel(Customer.name)
    private readonly customerModel: Model<CustomerDocument>,
  ) { }

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

  async update(id: number, updateCustomerDto: UpdateCustomerDto) {
    this.logger.log(`update called id=${id}`);
    return `This action updates a #${id} customer`;
  }

  async remove(id: number) {
    this.logger.log(`remove called id=${id}`);
    return `This action removes a #${id} customer`;
  }

  async addBoardToCustomer(customerId: Types.ObjectId | string, boardId: Types.ObjectId | string): Promise<void> {
    this.logger.log(`addBoardToCustomer() called customerId=${customerId} boardId=${boardId}`);

    try {
      const updated = await this.customerModel.findByIdAndUpdate(
        customerId,
        { $addToSet: { boardIds: boardId } },
        { new: true },
      ).exec();

      if (!updated) {
        this.logger.warn(`Customer not found id=${customerId}`);
        throw new NotFoundException(`Customer with id "${customerId}" not found`);
      }

    } catch (error) {
      this.logger.error(`Failed to add board to customer customerId=${customerId} boardId=${boardId}`, error.stack);
      throw error instanceof NotFoundException
        ? error
        : new InternalServerErrorException('Failed to add board to customer');
    }
  }

  async removeBoardFromCustomer(customerId: Types.ObjectId | string, boardId: Types.ObjectId | string): Promise<void> {
    this.logger.log(`removeBoardFromCustomer() called customerId=${customerId} boardId=${boardId}`);

    try {
      const updated = await this.customerModel.findByIdAndUpdate(
        customerId,
        { $pull: { boardIds: boardId } },
        { new: true },
      ).exec();

      if (!updated) {
        this.logger.warn(`Customer not found id=${customerId}`);
        throw new NotFoundException(`Customer with id "${customerId}" not found`);
      }

    } catch (error) {
      this.logger.error(`Failed to remove board from customer customerId=${customerId} boardId=${boardId}`, error.stack);
      throw error instanceof NotFoundException
        ? error
        : new InternalServerErrorException('Failed to remove board from customer');
    }
  }

  async findByName(name: string): Promise<CustomerDocument> {
    this.logger.log(`findByName called name=${name}`);

    const customer = await this.customerModel
      .findOne({ name })
      .exec();

    if (!customer) {
      this.logger.warn(`Customer not found name=${name}`);
      throw new NotFoundException(`Customer with name "${name}" not found`);
    }

    return customer;
  }

}

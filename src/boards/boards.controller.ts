import { Controller, Get, Post, Body, Patch, Param, Delete, Logger } from '@nestjs/common';
import { Types } from 'mongoose';
import { BoardsService } from './boards.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';

@Controller('boards')
export class BoardsController {
  private readonly logger = new Logger(BoardsController.name);

  constructor(private readonly boardsService: BoardsService) { }

  @Post()
  async create(@Body() createBoardDto: CreateBoardDto) {
    this.logger.log('create called');
    return await this.boardsService.create(createBoardDto);
  }

  @Get()
  async findAll() {
    this.logger.log('findAll called');
    return await this.boardsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    this.logger.log(`findOne called id=${id}`);
    return await this.boardsService.findOne(new Types.ObjectId(id));
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateBoardDto: UpdateBoardDto) {
    this.logger.log(`update called id=${id}`);
    return await this.boardsService.update(new Types.ObjectId(id), updateBoardDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    this.logger.log(`remove called id=${id}`);
    return await this.boardsService.remove(new Types.ObjectId(id));
  }

  @Post(':id/customers/:customerId')
  async addCustomer(@Param('id') id: string, @Param('customerId') customerId: string) {
    this.logger.log(`addCustomer called boardId=${id} customerId=${customerId}`);
    return await this.boardsService.addCustomerToBoard(
      new Types.ObjectId(id),
      new Types.ObjectId(customerId),
    );
  }

  // ✅ delete by customer name (string)
  @Delete(':id/environments/:enviormentname')
  async removeCustomerFromBoardByName(
    @Param('id') id: string,
    @Param('enviormentname') customername: string,
  ) {
    this.logger.log(`removeCustomer called boardId=${id} customername=${customername}`);
    return await this.boardsService.removeEnvirorment(new Types.ObjectId(id),
      customername as string,
    );
  }

  // POST /boards/:id/environments/:environmentName
  @Post(':id/environments/:environmentName')
  async addEnvironmentToBoard(
    @Param('id') id: string,
    @Param('environmentName') environmentName: string,
  ) {
    this.logger.log(
      `addEnvironmentToBoard called boardId=${id} environmentName=${environmentName}`,
    );

    return await this.boardsService.addEnvironmentToBoardByName(
      new Types.ObjectId(id),
      environmentName,
    );
  }



}

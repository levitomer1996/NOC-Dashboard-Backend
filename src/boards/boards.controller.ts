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
}

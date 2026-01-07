import { Injectable, NotFoundException, Logger, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { Board, BoardDocument } from './schemas/board.schema';

@Injectable()
export class BoardsService {
  private readonly logger = new Logger(BoardsService.name);

  constructor(
    @InjectModel(Board.name)
    private readonly boardModel: Model<BoardDocument>,
  ) { }

  async create(createBoardDto: CreateBoardDto): Promise<Board> {
    this.logger.log('create() called');

    try {
      const createdBoard = new this.boardModel(createBoardDto);
      this.logger.debug(`Board before save: ${JSON.stringify(createdBoard)}`);

      const saved = await createdBoard.save();
      this.logger.log(`Board created with id=${saved._id}`);
      return saved;

    } catch (error) {
      this.logger.error('Failed to create board', error.stack);
      throw new InternalServerErrorException('Failed to create board');
    }
  }

  async findAll(): Promise<Board[]> {
    this.logger.log('findAll() called');

    try {
      const boards = await this.boardModel.find().exec();
      this.logger.log(`Found ${boards.length} boards`);
      return boards;

    } catch (error) {
      this.logger.error('Failed to fetch boards', error.stack);
      throw new InternalServerErrorException('Failed to fetch boards');
    }
  }

  async findOne(id: Types.ObjectId): Promise<Board> {
    this.logger.log(`findOne() called id=${id}`);

    try {
      const board = await this.boardModel.findById(id).exec();

      if (!board) {
        this.logger.warn(`Board not found id=${id}`);
        throw new NotFoundException(`Board with id "${id}" not found`);
      }

      this.logger.log(`Board found id=${id}`);
      return board;

    } catch (error) {
      this.logger.error(`Failed to fetch board id=${id}`, error.stack);
      throw error instanceof NotFoundException
        ? error
        : new InternalServerErrorException('Failed to fetch board');
    }
  }

  async update(id: Types.ObjectId, updateBoardDto: UpdateBoardDto): Promise<Board> {
    this.logger.log(`update() called id=${id}`);

    try {
      const updated = await this.boardModel.findByIdAndUpdate(id, updateBoardDto, {
        new: true,
      }).exec();

      if (!updated) {
        this.logger.warn(`Board not found for update id=${id}`);
        throw new NotFoundException(`Board with id "${id}" not found`);
      }

      this.logger.log(`Board updated id=${id}`);
      this.logger.debug(`Updated board: ${JSON.stringify(updated)}`);

      return updated;

    } catch (error) {
      this.logger.error(`Failed to update board id=${id}`, error.stack);
      throw error instanceof NotFoundException
        ? error
        : new InternalServerErrorException('Failed to update board');
    }
  }

  async remove(id: Types.ObjectId): Promise<void> {
    this.logger.log(`remove() called id=${id}`);

    try {
      const deleted = await this.boardModel.findByIdAndDelete(id).exec();

      if (!deleted) {
        this.logger.warn(`Board not found for delete id=${id}`);
        throw new NotFoundException(`Board with id "${id}" not found`);
      }

      this.logger.log(`Board deleted id=${id}`);

    } catch (error) {
      this.logger.error(`Failed to delete board id=${id}`, error.stack);
      throw error instanceof NotFoundException
        ? error
        : new InternalServerErrorException('Failed to delete board');
    }
  }
}

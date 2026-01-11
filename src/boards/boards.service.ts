import { Injectable, NotFoundException, Logger, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { Board, BoardDocument } from './schemas/board.schema';
import { CustomersService } from '../customers/customers.service';

@Injectable()
export class BoardsService {
  private readonly logger = new Logger(BoardsService.name);

  constructor(
    @InjectModel(Board.name)
    private readonly boardModel: Model<BoardDocument>,
    private readonly customersService: CustomersService,
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

  async addCustomerToBoard(boardId: Types.ObjectId | string, customerId: Types.ObjectId | string): Promise<Board> {
    this.logger.log(`addCustomerToBoard() called boardId=${boardId} customerId=${customerId}`);

    try {
      const updated = await this.boardModel.findByIdAndUpdate(
        boardId,
        { $addToSet: { customers: customerId } },
        { new: true },
      ).exec();

      if (!updated) {
        this.logger.warn(`Board not found id=${boardId}`);
        throw new NotFoundException(`Board with id "${boardId}" not found`);
      }

      // update customer side
      await this.customersService.addBoardToCustomer(customerId, boardId);

      this.logger.log(`Customer ${customerId} added to board ${boardId}`);
      return updated;

    } catch (error) {
      this.logger.error(`Failed to add customer to board boardId=${boardId} customerId=${customerId}`, error.stack);
      throw error instanceof NotFoundException
        ? error
        : new InternalServerErrorException('Failed to add customer to board');
    }
  }

  async removeCustomerFromBoard(boardId: Types.ObjectId | string, customerId: Types.ObjectId | string): Promise<Board> {
    this.logger.log(`removeCustomerFromBoard() called boardId=${boardId} customerId=${customerId}`);

    try {
      const updated = await this.boardModel.findByIdAndUpdate(
        boardId,
        { $pull: { customers: customerId } },
        { new: true },
      ).exec();

      if (!updated) {
        this.logger.warn(`Board not found id=${boardId}`);
        throw new NotFoundException(`Board with id "${boardId}" not found`);
      }

      // update customer side
      await this.customersService.removeBoardFromCustomer(customerId, boardId);

      this.logger.log(`Customer ${customerId} removed from board ${boardId}`);
      return updated;

    } catch (error) {
      this.logger.error(`Failed to remove customer from board boardId=${boardId} customerId=${customerId}`, error.stack);
      throw error instanceof NotFoundException
        ? error
        : new InternalServerErrorException('Failed to remove customer from board');
    }
  }

  async removeCustomerFromBoardByName(boardId: Types.ObjectId | string, customerName: string): Promise<Board> {
    this.logger.log(`removeCustomerFromBoardByName() called boardId=${boardId} customerName=${customerName}`);
    try {
      // find customer by name
      const customer = await this.customersService.findByName(customerName);
      if (!customer) {
        this.logger.warn(`Customer not found with name=${customerName}`);
        throw new NotFoundException(`Customer with name "${customerName}" not found`);
      }
      return await this.removeCustomerFromBoard(boardId, customer._id);
    } catch (error) {
      this.logger.error(`Failed to find customer by name customerName=${customerName}`, error.stack);
      throw error instanceof NotFoundException
        ? error
        : new InternalServerErrorException('Failed to find customer by name');

    }
  }
  async removeEnvirorment(boardObjId: Types.ObjectId, customername: string) {
    this.logger.log(`removeEnvirorment() called boardId=${boardObjId} customername=${customername}`);

    return await this.boardModel.findByIdAndUpdate(
      boardObjId,
      { $pull: { environments: customername } },
      { new: true }
    ).exec();
  }

  async addEnvironmentToBoardByName(
    boardId: Types.ObjectId | string,
    environmentName: string,
  ) {
    this.logger.log(
      `addEnvironmentToBoardByName() called boardId=${boardId} environmentName=${environmentName}`,
    );

    try {
      const id =
        typeof boardId === 'string' ? new Types.ObjectId(boardId) : boardId;

      const updatedBoard = await this.boardModel
        .findByIdAndUpdate(
          id,
          { $addToSet: { environments: environmentName } }, // prevents duplicates
          { new: true },
        )
        .exec();

      if (!updatedBoard) {
        this.logger.warn(`Board not found id=${boardId}`);
        throw new NotFoundException(`Board with id "${boardId}" not found`);
      }

      return updatedBoard;
    } catch (error) {
      this.logger.error(
        `Failed to add environment to board boardId=${boardId} environmentName=${environmentName}`,
        error.stack,
      );
      throw error instanceof NotFoundException
        ? error
        : new InternalServerErrorException(
          'Failed to add environment to board',
        );
    }
  }
}
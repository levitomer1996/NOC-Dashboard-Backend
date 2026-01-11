import { Module } from '@nestjs/common';
import { BoardsService } from './boards.service';
import { BoardsController } from './boards.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Board } from './entities/board.entity';
import { BoardSchema } from './schemas/board.schema';
import { CustomersModule } from '../customers/customers.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Board.name, schema: BoardSchema }]),
    CustomersModule,
  ],
  controllers: [BoardsController],
  providers: [BoardsService],
})
export class BoardsModule { }

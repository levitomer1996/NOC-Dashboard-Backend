import { Module } from '@nestjs/common';
import { DictionaryService } from './dictionary.service';
import { DictionaryController } from './dictionary.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Dictionary } from './entities/dictionary.entity';
import { DictionarySchema } from './schemas/dictionary.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Dictionary.name, schema: DictionarySchema }]),
  ],
  controllers: [DictionaryController],
  providers: [DictionaryService],
  exports: [DictionaryService],
})
export class DictionaryModule { }

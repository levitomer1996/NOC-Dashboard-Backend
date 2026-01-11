import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { DictionaryService } from './dictionary.service';
import { Logger } from '@nestjs/common';
import { CreateDictionaryDto } from './dto/create-dictionary.dto';
import { UpdateDictionaryDto } from './dto/update-dictionary.dto';
import { AddTagDto } from './dto/add-tag.dto';


@Controller('dictionary')
export class DictionaryController {
  private readonly logger = new Logger(DictionaryController.name);

  constructor(private readonly dictionaryService: DictionaryService) { }

  @Post()
  async create(@Body() dto: CreateDictionaryDto) {
    this.logger.log(`create request: name=${dto?.name}`);
    try {
      return await this.dictionaryService.create(dto);
    } catch (err) {
      this.logger.error('create failed', err?.stack ?? err);
      throw err;
    }
  }

  /**
   * GET /dictionary
   * GET /dictionary?name=ENV_DICTIONARY
   */
  @Get()
  async findAllOrByName(@Query('name') name?: string) {
    this.logger.log(`findAllOrByName request: name=${name ?? '<all>'}`);
    try {
      if (name) return await this.dictionaryService.findByName(name);
      return await this.dictionaryService.findAll();
    } catch (err) {
      this.logger.error('findAllOrByName failed', err?.stack ?? err);
      throw err;
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    this.logger.log(`findOne request: id=${id}`);
    try {
      return await this.dictionaryService.findOne(id);
    } catch (err) {
      this.logger.error(`findOne failed id=${id}`, err?.stack ?? err);
      throw err;
    }
  }

  /**
   * PATCH /dictionary/by-name/:name/entry/:key/tag
   * body: { "tag": "sometag" }
   */
  @Patch('by-name/:name/entry/:key/tag')
  async addTag(@Param('name') name: string, @Param('key') key: string, @Body() body: AddTagDto) {
    this.logger.log(`addTag request: name=${name} key=${key} tag=${body?.tag}`);
    try {
      return await this.dictionaryService.addTagByName(name, key, body.tag);
    } catch (err) {
      this.logger.error(`addTag failed name=${name} key=${key}`, err?.stack ?? err);
      throw err;
    }
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateDictionaryDto) {
    this.logger.log(`update request: id=${id}`);
    try {
      return await this.dictionaryService.update(id, dto);
    } catch (err) {
      this.logger.error(`update failed id=${id}`, err?.stack ?? err);
      throw err;
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    this.logger.log(`remove request: id=${id}`);
    try {
      return await this.dictionaryService.remove(id);
    } catch (err) {
      this.logger.error(`remove failed id=${id}`, err?.stack ?? err);
      throw err;
    }
  }

  /**
   * GET /dictionary/by-name/ENV_DICTIONARY/entry/AGLC
   */
  @Get('by-name/:name/entry/:key')
  async getEntryByName(@Param('name') name: string, @Param('key') key: string) {
    this.logger.log(`getEntryByName request: name=${name} key=${key}`);
    try {
      return await this.dictionaryService.getEntryByName(name, key);
    } catch (err) {
      this.logger.error(`getEntryByName failed name=${name} key=${key}`, err?.stack ?? err);
      throw err;
    }
  }

  @Post('add-entry-to-dictionary/:dictionaryName/:enteryName/:value')
  async addEntryToDictionary(
    @Param('dictionaryName') dictionaryName: string,
    @Param('enteryName') enteryName: string,
    @Param('value') value: string,
  ) {
    this.logger.log(`addEntryToDictionary request: dictionaryName=${dictionaryName} enteryName=${enteryName} value=${value}`);
    try {
      return await this.dictionaryService.addValueToEntryByName(dictionaryName, enteryName, value);
    } catch (err) {
      this.logger.error(`addEntryToDictionary failed dictionaryName=${dictionaryName} enteryName=${enteryName}`, err?.stack ?? err);
      throw err;
    }
  }
}
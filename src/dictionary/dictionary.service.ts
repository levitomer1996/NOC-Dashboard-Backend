import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateDictionaryDto } from './dto/create-dictionary.dto';
import { UpdateDictionaryDto } from './dto/update-dictionary.dto';
import { Dictionary, DictionaryDocument } from './schemas/dictionary.schema';

@Injectable()
export class DictionaryService {
  async addEntryToDictionary(dicId: string, enteryName: string) {
    throw new Error('Method not implemented.');
  }
  private readonly logger = new Logger(DictionaryService.name);
  constructor(
    @InjectModel(Dictionary.name)
    private readonly dictionaryModel: Model<DictionaryDocument>,
  ) { }

  async create(dto: CreateDictionaryDto) {
    this.logger.log(`create: name=${dto?.name}`);
    try {
      return await this.dictionaryModel.create({
        name: dto.name,
        entries: dto.entries,
      });
    } catch (err) {
      this.logger.error('create failed', err?.stack ?? err);
      throw err;
    }
  }

  async findAll() {
    this.logger.log('findAll');
    try {
      return await this.dictionaryModel.find().lean();
    } catch (err) {
      this.logger.error('findAll failed', err?.stack ?? err);
      throw err;
    }
  }

  async findOne(id: string) {
    this.logger.log(`findOne: id=${id}`);
    try {
      const doc = await this.dictionaryModel.findById(id).lean();
      if (!doc) {
        this.logger.warn(`findOne: not found id=${id}`);
        throw new NotFoundException('Dictionary not found');
      }
      return doc;
    } catch (err) {
      this.logger.error(`findOne failed id=${id}`, err?.stack ?? err);
      throw err;
    }
  }

  async findByName(name: string) {
    this.logger.log(`findByName: name=${name}`);
    try {
      const doc = await this.dictionaryModel.findOne({ name }).lean();
      if (!doc) {
        this.logger.warn(`findByName: not found name=${name}`);
        throw new NotFoundException('Dictionary not found');
      }
      return doc;
    } catch (err) {
      this.logger.error(`findByName failed name=${name}`, err?.stack ?? err);
      throw err;
    }
  }

  async update(id: string, dto: UpdateDictionaryDto) {
    this.logger.log(`update: id=${id}`);
    try {
      const updated = await this.dictionaryModel
        .findByIdAndUpdate(id, dto, { new: true })
        .lean();

      if (!updated) {
        this.logger.warn(`update: not found id=${id}`);
        throw new NotFoundException('Dictionary not found');
      }
      return updated;
    } catch (err) {
      this.logger.error(`update failed id=${id}`, err?.stack ?? err);
      throw err;
    }
  }

  async remove(id: string) {
    this.logger.log(`remove: id=${id}`);
    try {
      const deleted = await this.dictionaryModel.findByIdAndDelete(id).lean();
      if (!deleted) {
        this.logger.warn(`remove: not found id=${id}`);
        throw new NotFoundException('Dictionary not found');
      }
      return deleted;
    } catch (err) {
      this.logger.error(`remove failed id=${id}`, err?.stack ?? err);
      throw err;
    }
  }

  // Set a single key (e.g. "AGLC") with new array of strings
  async setEntryByName(name: string, key: string, values: string[]) {
    this.logger.log(`setEntryByName: name=${name} key=${key}`);
    try {
      const updated = await this.dictionaryModel
        .findOneAndUpdate(
          { name },
          { $set: { [`entries.${key}`]: values } },
          { new: true, upsert: false },
        )
        .lean();

      if (!updated) {
        this.logger.warn(`setEntryByName: not found name=${name}`);
        throw new NotFoundException('Dictionary not found');
      }
      return updated;
    } catch (err) {
      this.logger.error(`setEntryByName failed name=${name} key=${key}`, err?.stack ?? err);
      throw err;
    }
  }

  async getEntryByName(name: string, key: string) {
    this.logger.log(`getEntryByName: name=${name} key=${key}`);
    try {
      const doc = await this.dictionaryModel.findOne({ name }).lean();
      if (!doc) {
        this.logger.warn(`getEntryByName: not found name=${name}`);
        throw new NotFoundException('Dictionary not found');
      }

      const entriesObj = (doc as any).entries ?? {};
      return { key, values: entriesObj[key] ?? null };
    } catch (err) {
      this.logger.error(`getEntryByName failed name=${name} key=${key}`, err?.stack ?? err);
      throw err;
    }
  }

  /**
   * Add a single tag to an existing entry array for a dictionary by name.
   * Uses $addToSet to avoid duplicates.
   */
  async addTagByName(name: string, key: string, tag: string) {
    this.logger.log(`addTagByName: name=${name} key=${key} tag=${tag}`);
    try {
      const updated = await this.dictionaryModel
        .findOneAndUpdate(
          { name },
          { $addToSet: { [`entries.${key}`]: tag } },
          { new: true, upsert: false },
        )
        .lean();

      if (!updated) {
        this.logger.warn(`addTagByName: not found name=${name}`);
        throw new NotFoundException('Dictionary not found');
      }
      return updated;
    } catch (err) {
      this.logger.error(`addTagByName failed name=${name} key=${key}`, err?.stack ?? err);
      throw err;
    }
  }
  /**
   * Append a value to an entry's array for a dictionary by name.
   * - If the entry key doesn't exist, it will be created.
   * - If `value` is provided, use $addToSet to avoid duplicates.
   * - If no `value` provided, create the key with an empty array.
   */
  async addValueToEntryByName(dictionaryName: string, entryName: string, value?: string) {
    this.logger.log(
      `addValueToEntryByName: dictionaryName=${dictionaryName} entryName=${entryName} value=${value ?? '<none>'}`,
    );

    try {
      // 1) Ensure dictionary exists (no lean here; we will update anyway)
      const exists = await this.dictionaryModel.exists({ name: dictionaryName });
      if (!exists) {
        this.logger.warn(`addValueToEntryByName: not found dictionaryName=${dictionaryName}`);
        throw new NotFoundException('Dictionary not found');
      }

      // 2) If value is not provided -> ensure entry exists (create empty array if missing)
      if (value === undefined || value === null || String(value).trim() === '') {
        const updated = await this.dictionaryModel
          .findOneAndUpdate(
            { name: dictionaryName },
            {
              $setOnInsert: { name: dictionaryName },
              $set: { [`entries.${entryName}`]: [] }, // create/overwrite to empty array
            },
            { new: true },
          )
          .lean();

        return updated;
      }

      const cleanedValue = String(value).trim();

      // 3) If value provided -> add to array, create array if missing
      const updatedWithValue = await this.dictionaryModel
        .findOneAndUpdate(
          { name: dictionaryName },
          {
            $setOnInsert: { name: dictionaryName },
            $addToSet: { [`entries.${entryName}`]: cleanedValue },
          },
          { new: true },
        )
        .lean();

      return updatedWithValue;
    } catch (err) {
      this.logger.error(
        `addValueToEntryByName failed dictionaryName=${dictionaryName} entryName=${entryName} value=${value ?? '<none>'}`,
        err?.stack ?? err,
      );
      throw err;
    }
  }

}
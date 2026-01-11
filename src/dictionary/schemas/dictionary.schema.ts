import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type DictionaryDocument = Dictionary & Document;

@Schema({ timestamps: true, collection: 'dictionaries' })
export class Dictionary {

    @Prop({ required: true, unique: true, trim: true })
    name: string;


    @Prop({
        type: Map,
        of: [String],
        required: true,
        default: {},
    })
    entries: Map<string, string[]>;
}

export const DictionarySchema = SchemaFactory.createForClass(Dictionary);

// Helpful indexes (unique already creates an index, but explicit is fine)
DictionarySchema.index({ name: 1 }, { unique: true });

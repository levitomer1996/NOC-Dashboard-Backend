import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type BoardDocument = Board & Document;

@Schema({ timestamps: true })
export class Board {
    @Prop({ required: true, unique: true })
    name: string;

    @Prop()
    description?: string;

    @Prop({ default: false })
    isDefault: boolean;

    // NEW: array of environments (columns)
    @Prop({ type: [String], default: [] })
    environments: string[];

    // NEW: array of metrics (rows)
    @Prop({ type: [String], default: [] })
    metrics: string[];

    @Prop({ type: [Types.ObjectId], ref: 'Customer', default: [] })
    customers?: Types.ObjectId[];
}

export const BoardSchema = SchemaFactory.createForClass(Board);

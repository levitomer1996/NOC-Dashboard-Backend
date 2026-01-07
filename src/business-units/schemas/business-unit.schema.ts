import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type BusinessUnitDocument = BusinessUnit & Document;

@Schema({ timestamps: true })
export class BusinessUnit {
    @Prop({ type: Types.ObjectId, ref: 'Board', required: true })
    boardId: Types.ObjectId;

    @Prop({ required: true })
    name: string;

    @Prop()
    description?: string;

    @Prop({ default: 0 })
    order: number;

    @Prop({ default: true })
    isActive: boolean;
}

export const BusinessUnitSchema = SchemaFactory.createForClass(BusinessUnit);

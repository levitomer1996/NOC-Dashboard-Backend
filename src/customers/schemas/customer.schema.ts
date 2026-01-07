import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type CustomerDocument = Customer & Document;

@Schema({ timestamps: true })
export class Customer {
    @Prop({ type: Types.ObjectId, ref: 'BusinessUnit', required: true })
    businessUnitId: Types.ObjectId;

    @Prop({ required: true })
    name: string;

    @Prop()
    code?: string; // e.g. "MI"

    @Prop()
    timezone?: string; // e.g. "America/Detroit"

    @Prop({ default: 'active', enum: ['active', 'inactive'] })
    status: 'active' | 'inactive';

    @Prop()
    notes?: string;
}

export const CustomerSchema = SchemaFactory.createForClass(Customer);

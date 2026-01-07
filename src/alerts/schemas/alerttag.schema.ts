import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AlertTagDocument = AlertTag & Document;

@Schema({ timestamps: true })
export class AlertTag {
    @Prop({ required: true, unique: true })
    title: string;

    @Prop({ required: true })
    env: string;

    @Prop({ required: true })
    metric: string;
}

export const AlertTagSchema = SchemaFactory.createForClass(AlertTag);

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type MonitorDocument = Monitor & Document;

@Schema({ timestamps: true })
export class Monitor {
    @Prop({ type: Types.ObjectId, ref: 'Customer', required: true })
    customerId: Types.ObjectId;

    @Prop({ required: true })
    name: string;

    @Prop({
        enum: ['metric', 'synthetic', 'external', 'internal'],
        default: 'metric',
    })
    type: 'metric' | 'synthetic' | 'external' | 'internal';

    @Prop({
        enum: ['ok', 'warning', 'critical', 'unknown'],
        default: 'unknown',
    })
    status: 'ok' | 'warning' | 'critical' | 'unknown';

    @Prop({ default: 3, min: 1, max: 5 })
    severity: number;

    @Prop()
    source?: string; // Datadog, Coralogix...

    @Prop()
    lastTriggeredAt?: Date;

    @Prop()
    lastCheckedAt?: Date;

    @Prop({ default: false })
    isMuted: boolean;

    @Prop({ type: Object })
    metadata?: Record<string, any>;
}

export const MonitorSchema = SchemaFactory.createForClass(Monitor);

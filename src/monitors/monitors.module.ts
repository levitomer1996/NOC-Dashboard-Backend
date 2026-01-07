import { Module } from '@nestjs/common';
import { MonitorsService } from './monitors.service';
import { MonitorsController } from './monitors.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Monitor } from './entities/monitor.entity';
import { MonitorSchema } from './schemas/monitor.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Monitor.name, schema: MonitorSchema }]),
  ],
  controllers: [MonitorsController],
  providers: [MonitorsService],
})
export class MonitorsModule { }

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BoardsModule } from './boards/boards.module';
import { BusinessUnitsModule } from './business-units/business-units.module';
import { CustomersModule } from './customers/customers.module';
import { MonitorsModule } from './monitors/monitors.module';
import { ScheduleModule } from '@nestjs/schedule';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { AlertsGateway } from './alerts/alerts.gateway';
import { OpsgenieController } from './alerts/opsgenie/opsgenie.controller';
import { OpsgenieService } from './alerts/opsgenie/opsgenie.service';
import { AlertsModule } from './alerts/alerts.module';

@Module({
  imports: [BoardsModule, BusinessUnitsModule, CustomersModule, MonitorsModule, AuthModule, AlertsModule, ConfigModule.forRoot({
    isGlobal: true,        // makes .env accessible everywhere
  }),
    MongooseModule.forRoot(process.env.MONGO_URI as string),
    AlertsModule, ScheduleModule.forRoot(), // important
  ],
  controllers: [AppController, OpsgenieController],
  providers: [AppService, AlertsGateway],
})
export class AppModule { }

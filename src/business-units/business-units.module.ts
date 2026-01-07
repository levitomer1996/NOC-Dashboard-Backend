import { Module } from '@nestjs/common';
import { BusinessUnitsService } from './business-units.service';
import { BusinessUnitsController } from './business-units.controller';
import { BusinessUnitSchema } from './schemas/business-unit.schema';
import { BusinessUnit } from './entities/business-unit.entity';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: BusinessUnit.name, schema: BusinessUnitSchema },
    ]),
  ],
  controllers: [BusinessUnitsController],
  providers: [BusinessUnitsService],
})
export class BusinessUnitsModule { }

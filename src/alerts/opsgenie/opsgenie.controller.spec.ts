import { Test, TestingModule } from '@nestjs/testing';
import { OpsgenieController } from './opsgenie.controller';

describe('OpsgenieController', () => {
  let controller: OpsgenieController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OpsgenieController],
    }).compile();

    controller = module.get<OpsgenieController>(OpsgenieController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

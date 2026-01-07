import { Test, TestingModule } from '@nestjs/testing';
import { OpsgenieService } from './opsgenie.service';

describe('OpsgenieService', () => {
  let service: OpsgenieService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OpsgenieService],
    }).compile();

    service = module.get<OpsgenieService>(OpsgenieService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

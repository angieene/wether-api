import { Test, TestingModule } from '@nestjs/testing';

import { WetherService } from './wether.service';

describe('WetherService', () => {
  let service: WetherService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WetherService],
    }).compile();

    service = module.get<WetherService>(WetherService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

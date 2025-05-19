import { Test, TestingModule } from '@nestjs/testing';

import { WetherController } from './wether.controller';
import { WetherService } from './wether.service';

describe('WetherController', () => {
  let controller: WetherController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WetherController],
      providers: [WetherService],
    }).compile();

    controller = module.get<WetherController>(WetherController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

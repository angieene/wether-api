import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';

import { WetherController } from './wether.controller';
import { WetherService } from './wether.service';

@Module({
  imports: [HttpModule],
  controllers: [WetherController],
  providers: [WetherService],
})
export class WetherModule {}

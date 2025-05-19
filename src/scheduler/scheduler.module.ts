import { BullModule } from '@nestjs/bull';
import { Global, Module } from '@nestjs/common';

import { SchedulerQueue } from './enum/scheduler-queues.enum';
import { SchedulerService } from './scheduler.service';

@Global()
@Module({
  imports: [BullModule.registerQueue({ name: SchedulerQueue.SUBSCRIPTION_QUEUE })],
  providers: [SchedulerService],
  exports: [SchedulerService],
})
export class SchedulerModule {}

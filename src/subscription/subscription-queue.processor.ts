import { InjectQueue, Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';

import { Job, Queue } from 'bull';

import { SchedulerName } from 'src/scheduler/enum/scheduler-names.enum';
import { SchedulerQueue } from 'src/scheduler/enum/scheduler-queues.enum';

import { SubscriptionService } from './subscription.service';

@Processor(SchedulerQueue.SUBSCRIPTION_QUEUE)
export class SubscriptionQueueProcessor {
  private readonly logger = new Logger(SubscriptionQueueProcessor.name);

  constructor(
    @InjectQueue(SchedulerQueue.SUBSCRIPTION_QUEUE)
    private readonly subscriptionQueue: Queue,
    private readonly subscriptionService: SubscriptionService,
  ) {}

  @Process(SchedulerName.SUBSCRIPTION_SUBSCRIBE)
  private async subscriptionSubscribe(job: Job<{ userId: number; subscriptionId: number }>) {
    const { userId, subscriptionId } = job.data;
    this.logger.log(
      `Processing subscription for user ${userId} with subscription ID ${subscriptionId}`,
    );

    try {
      this.logger.log(`Subscription activated for user ${userId}`);
      await job.moveToCompleted('Subscription processed', true);
    } catch (error) {
      this.logger.error(`Error processing subscription for user ${userId}: ${error.message}`);
      await job.moveToFailed({ message: error.message });
    }
  }

  @Process(SchedulerName.SUBSCRIPTION_CANCELED)
  private async subscriptionCanceled(job: Job<number>) {
    const subscriptionId = job.data;
    this.logger.log(`Processing subscription cancellation for ID ${subscriptionId}`);

    try {
      this.logger.log(`Subscription ${subscriptionId} canceled successfully`);
      await job.moveToCompleted('Subscription canceled', true);
    } catch (error) {
      this.logger.error(`Error cancelling subscription ${subscriptionId}: ${error.message}`);
      await job.moveToFailed({ message: error.message });
    }
  }
}

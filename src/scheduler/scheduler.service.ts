import { InjectQueue } from '@nestjs/bull';
import { Injectable, Logger } from '@nestjs/common';

import { Queue } from 'bull';

import { dateToDelay } from '../common/utils/date';
import { SchedulerName } from './enum/scheduler-names.enum';
import { SchedulerQueue } from './enum/scheduler-queues.enum';

@Injectable()
export class SchedulerService {
  private logger = new Logger(SchedulerService.name);
  constructor(
    @InjectQueue(SchedulerQueue.SUBSCRIPTION_QUEUE)
    private subscriptionQueue: Queue,
  ) {}

  async schedule(date: Date, name: SchedulerName, data: any, queue: SchedulerQueue) {
    this.logger.log(
      `Scheduling job: ${name} at ${date.toISOString()} with data: ${JSON.stringify(data)}`,
    );

    const targetQueue = this[queue];
    if (!targetQueue) {
      throw new Error(`Invalid queue: ${queue}`);
    }

    const delay = dateToDelay(date);
    console.log('delay', date, delay);

    if (delay < 0) {
      this.logger.warn(`Attempted to schedule job in the past: ${name}`);
      return null;
    }

    const job = await targetQueue.add(name, data, {
      delay,
      attempts: 3,
      backoff: 5000,
      removeOnComplete: true,
    });
    return job;
  }

  async cancel(jobId: string | number, queue: SchedulerQueue) {
    console.log('cancel job', jobId, queue);

    try {
      const targetQueue = this[queue];
      if (!targetQueue) {
        throw new Error(`Invalid queue: ${queue}`);
      }
      const job = await targetQueue.getJob(jobId);
      console.log('cancel job', job, 'targetQueue', targetQueue.name);
      if (job) {
        await job.remove();
        this.logger.log(`Successfully cancelled job ${jobId}`);
        return true;
      } else {
        this.logger.warn(`Job ${jobId} not found`);
        return false;
      }
    } catch (error) {
      this.logger.error(`Error cancelling job ${jobId}: ${error.message}`);
      return false;
    }
  }
}

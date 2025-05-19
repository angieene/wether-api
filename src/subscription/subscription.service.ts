import { InjectQueue } from '@nestjs/bull';
import { HttpException, HttpStatus, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Queue } from 'bull';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

import { EntityService } from 'src/abstractions/entity-service.abstraction';
import { EmailService } from 'src/common/services/email.service';
import { SchedulerName } from 'src/scheduler/enum/scheduler-names.enum';
import { SchedulerQueue } from 'src/scheduler/enum/scheduler-queues.enum';

import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { Subscription } from './entities/subscription.entity';

@Injectable()
export class SubscriptionService extends EntityService<Subscription> {
  private readonly logger = new Logger(SubscriptionService.name);

  constructor(
    @InjectRepository(Subscription)
    protected readonly _repository: Repository<Subscription>,
    private readonly emailService: EmailService,
    @InjectQueue(SchedulerQueue.SUBSCRIPTION_QUEUE)
    private subscriptionQueue: Queue,
  ) {
    super();
  }

  async subscribe(body: CreateSubscriptionDto) {
    const { email, city } = body;

    const existing = await this.findOne({ where: { email, city } });
    if (existing) {
      throw new HttpException('Email already subscribed', HttpStatus.CONFLICT);
    }

    const subscription = await this.save({
      ...body,
      token: uuidv4(),
      confirmed: false,
    });

    await this.emailService.sendConfirmationEmail(email, subscription.token);
    await this.subscriptionQueue.add(SchedulerName.SUBSCRIPTION_SUBSCRIBE, {
      subscriptionId: subscription.id,
    });
    return { message: 'Subscription successful. Confirmation email sent.' };
  }

  async confirmSubscription(token: string) {
    const subscription = await this.findOne({ where: { token } });
    if (!subscription) {
      throw new NotFoundException('Token not found');
    }

    subscription.confirmed = true;
    await this.save(subscription);

    return { message: 'Subscription confirmed successfully' };
  }

  async unsubscribe(token: string) {
    const subscription = await this.findOne({ where: { token } });
    if (!subscription) {
      throw new NotFoundException('Token not found');
    }

    await this.subscriptionQueue.add(SchedulerName.SUBSCRIPTION_CANCELED, {
      token,
    });

    await this.delete(subscription.id);

    return { message: 'Unsubscribed successfully' };
  }
}

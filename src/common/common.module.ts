import { Module } from '@nestjs/common';

import { MailerModule } from '@nestjs-modules/mailer';

import { config } from 'src/common/configuration';

import { EmailService } from './services/email.service';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        service: config.email.service || 'Gmail',
        auth: {
          user: config.email.user,
          pass: config.email.pass,
        },
      },
    }),
  ],
  providers: [EmailService],
  exports: [EmailService],
})
export class CommonModule {}

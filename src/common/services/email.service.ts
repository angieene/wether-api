import { Injectable } from '@nestjs/common';

import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class EmailService {
  constructor(private readonly mailService: MailerService) {}

  async sendConfirmationEmail(email: string, token: string) {
    await this.mailService.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Weather Subscription Confirmation',
      html: `<p>Please confirm your subscription by clicking <a href="${process.env.BASE_URL}/subscribe/confirm/${token}">here</a>.</p>`,
    });
  }

  async sendGeneralEmail(to: string, subject: string, htmlContent: string) {
    await this.mailService.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      html: htmlContent,
    });
  }
}

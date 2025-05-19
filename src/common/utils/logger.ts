import { ConsoleLogger } from '@nestjs/common';

export class AppLogger extends ConsoleLogger {
  constructor(context?: string) {
    super(context ?? 'context');
  }
}

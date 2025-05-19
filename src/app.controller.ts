import { HttpService } from '@nestjs/axios';
import { Controller } from '@nestjs/common';

@Controller('app')
export class AppController {
  constructor(private readonly httpService: HttpService) {}
}

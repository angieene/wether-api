import { HttpService } from '@nestjs/axios';
import { Injectable, NotFoundException } from '@nestjs/common';

import { lastValueFrom } from 'rxjs';

import { config } from 'src/common/configuration';

@Injectable()
export class WetherService {
  constructor(private readonly httpService: HttpService) {}

  async getWeather(city: string) {
    const url = `https://api.weatherapi.com/v1/current.json?key=${config.weather.apiKey}&q=${city}`;
    const response = await lastValueFrom(this.httpService.get(url));

    if (!response.data) {
      throw new NotFoundException('City not found');
    }

    return {
      temperature: response.data.current.temp_c,
      humidity: response.data.current.humidity,
      description: response.data.current.condition.text,
    };
  }
}

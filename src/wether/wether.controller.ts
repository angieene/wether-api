import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

import { GetWetherDto } from './dto/get-wether.dto';
import { WetherService } from './wether.service';

@Controller('wether')
export class WetherController {
  constructor(private readonly wetherService: WetherService) {}

  @Get()
  @ApiOperation({
    summary: 'Get current weather for a city',
    description:
      'Returns the current weather forecast for the specified city using WeatherAPI.com.',
  })
  @ApiResponse({
    status: 200,
    description: 'Successful operation - current weather forecast returned',
    example: {
      temperature: 0,
      humidity: 0,
      description: 'string',
    },
  })
  @ApiQuery({
    name: 'city',
    required: true,
    type: String,
    description: 'City name for weather forecast',
  })
  @ApiResponse({ status: 400, description: 'Invalid request' })
  @ApiResponse({ status: 404, description: 'City not found' })
  getWether(@Query() query: GetWetherDto) {
    return this.wetherService.getWeather(query.city);
  }
}

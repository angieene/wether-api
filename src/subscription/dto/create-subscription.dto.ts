import { ApiProperty } from '@nestjs/swagger';

import { IsEmail, IsEnum, IsString } from 'class-validator';

import { Frequency } from '../entities/subscription.entity';

export class CreateSubscriptionDto {
  @ApiProperty({
    description: 'Email address to subscribe',
    example: 'test@example.com',
    type: 'string',
    format: 'email',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'City for weather updates',
    example: 'Kyiv',
    type: 'string',
  })
  @IsString()
  city: string;

  @ApiProperty({
    description: 'Frequency of updates (hourly or daily)',
    enum: Frequency,
    enumName: 'Frequency',
    example: 'hourly',
  })
  @IsEnum(Frequency)
  frequency: Frequency;
}

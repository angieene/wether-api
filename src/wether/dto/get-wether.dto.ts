import { IsString } from 'class-validator';

export class GetWetherDto {
  @IsString()
  city: string;
}

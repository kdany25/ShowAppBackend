import { Organisation } from 'src/organisation/entities/organisation.entity';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDate,
  IsDefined,
  IsEmpty,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  MinLength,
} from 'class-validator';

export class CreateEventDto {
  @IsNotEmpty()
  eventId: string;

  title: string;

  thumbnail: string;

  description: string;

  eventDate: Date;

  eventHour: Date;

  isPublished: boolean;

  isCanceled: boolean;

  eventCategory: string;

  vvipAvailabelSeats: number;

  vvipPrice: number;

  vipAvailabelSeats: number;

  vipPrice: number;

  regularAvailabelSeats: number;

  regularPrice: number;

  organisation: Organisation;
}
export class QueryParamDto {
  title: string;
}

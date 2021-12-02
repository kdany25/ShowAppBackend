/* eslint-disable prettier/prettier */
import { PartialType } from '@nestjs/mapped-types';
import { IsArray, IsEmail, IsIn, IsOptional } from 'class-validator';
import { Organisation } from 'src/organisation/entities/organisation.entity';
import { Ticket } from 'src/ticket/entities/ticket.entity';
import { ApiProperty } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  userId: string;
  @IsOptional()
  firstName?: string;

  @IsOptional()
  lastName?: string;

  @IsOptional()
  phone?: string;

  @IsOptional()
  dOb?: Date;

  @IsOptional()
  avatar?: string;

  @IsOptional()
  @IsIn(['MALE','FEMALE','OTHER'])
  gender?: 'MALE'|'FEMALE'|'OTHER';

}

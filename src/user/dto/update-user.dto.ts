/* eslint-disable prettier/prettier */
import { IsArray, IsEmail, IsIn } from 'class-validator';
import { Organisation } from 'src/organisation/entities/organisation.entity';
import { Ticket } from 'src/ticket/entities/ticket.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Optional } from '@nestjs/common';
export class UpdateUserDto {
  userId: string;
  @Optional()
  @ApiProperty({
    description: 'This is a user first name',
  })
  firstName?: string;

  @Optional()
  @ApiProperty({
    description: 'This is a user last name',
  })
  lastName?: string;

  @Optional()
  @IsEmail()
  @ApiProperty({
    description: 'This is a user email',
  })
  email?: string;

  @Optional()
  @ApiProperty({
    description: 'This is a user phone number',
  })
  phone?: string;

  @Optional()
  @ApiProperty({
    description: 'This is a user date of birth',
  })
  dOb?: Date;

  @Optional()
  @ApiProperty({
    description: 'This is a user avatar profile',
  })
  avatar?: string;

  @Optional()
  @IsIn(['MALE','FEMALE','OTHER'])
  @ApiProperty({
    enum: [ 'MALE','FEMALE','OTHER'],
    description: 'This is a user email',
  })
  gender?: 'MALE'|'FEMALE'|'OTHER';

}

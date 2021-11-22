/* eslint-disable prettier/prettier */
import { IsArray, IsEmail, IsIn } from 'class-validator';
import { Organisation } from 'src/organisation/entities/organisation.entity';
import { Ticket } from 'src/ticket/entities/ticket.entity';
import { ApiProperty } from '@nestjs/swagger';
export class UpdateUserDto {
  userId: string;

  @ApiProperty({
    description: 'This is a user first name',
  })
  firstName: string;

  @ApiProperty({
    description: 'This is a user last name',
  })
  lastName: string;

  @IsEmail()
  @ApiProperty({
    description: 'This is a user email',
  })
  email: string;

  @ApiProperty({
    description: 'This is a user phone number',
  })
  phone: string;

  @ApiProperty({
    description: 'This is a user date of birth',
  })
  dOb: Date;

  @ApiProperty({
    description: 'This is a user avatar profile',
  })
  avatar: string;

  @IsIn(['MALE','FEMALE','OTHER'])
  @ApiProperty({
    enum: [ 'MALE','FEMALE','OTHER'],
    description: 'This is a user email',
  })
  gender: 'MALE'|'FEMALE'|'OTHER';

  @IsArray()
  @ApiProperty({
    description: 'This is a organizations of a user',
  })
  organisation:Organisation[];

  @IsArray()
  @ApiProperty({
    description: 'Those are user tickets ',
  })
  tickets: Ticket[];
}

/* eslint-disable prettier/prettier */
import { IsEmail, IsDate, IsIn, IsArray,IsNotEmpty, IsOptional, IsPhoneNumber, Matches, MinLength, IsDateString } from 'class-validator';
import { Organisation } from 'src/organisation/entities/organisation.entity';
import { Ticket } from 'src/ticket/entities/ticket.entity';
import { ApiProperty,ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUserDto {


  userId: string;

  @IsNotEmpty()
  @ApiProperty({description:'This is the user first name',default:'Ntwari'})
  firstName: string;

  @ApiProperty({ description: 'This is the user last name', default: 'Hugues' })
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({ description: 'This is the user email', default: 'ntwari.hugues@gmail.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  /* @IsIn(['USER','ORGANISER','ADMIN'])
  role: 'USER'|'ORGANISER'|'ADMIN'; */
  @ApiProperty({ description: 'This is the user password', default: 'Taskforce2' })
  @IsNotEmpty()
  @MinLength(8,{message:"Password must be at least 8 characters"})
  password: string;

  @ApiProperty({ description: 'This is the user phone number', default: '+250781407229' })
  @IsNotEmpty()
  @IsPhoneNumber()
  phone: string;
  
  @ApiProperty({ description: 'This is the user date of birth', default: '1996-01-16' })
  @IsNotEmpty()
  @IsDateString()
  dOb: Date;

  @IsOptional()
  @ApiProperty({ description: 'This is the users avatar', default: 'https://www.cobdoglaps.sa.edu.au/wp-content/uploads/2017/11/placeholder-profile-sq.jpg' })
  avatar: string;

  @ApiProperty({ description: 'This is the user gender', default: 'MALE' })
  @IsNotEmpty()
  @IsIn(['MALE','FEMALE','OTHER'])
  gender: 'MALE'|'FEMALE'|'OTHER';

  @ApiProperty({
    description: 'These are organisations created by the user',
  })
  @IsOptional()
  @IsArray()
  organisation:Organisation[];

  @ApiProperty({
    description: 'These are tickets by the user ',
  })
  @IsOptional()
  @IsArray()
  tickets: Ticket[];
}

export class CreateUserResponseDto {
  // constructor( private readonly firstName:string, private readonly lastName:string, private readonly email:string){}
  firstName: string;

  lastName: string;

  email: string;
}

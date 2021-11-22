/* eslint-disable prettier/prettier */
import { IsEmail, IsDate, IsIn, IsArray,IsNotEmpty, IsOptional } from 'class-validator';
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
  @ApiProperty({ description: 'This is the user password', default: '18700' })
  @IsNotEmpty()
  password: string;

  @ApiProperty({ description: 'This is the user phone number', default: '0781407229' })
  @IsNotEmpty()
  phone: string;
  
  @ApiProperty({ description: 'This is the user date of birth', default: '1996/01/16' })
  @IsNotEmpty()
  // @IsDate({message:'Date of Birth has to be a valid date'})
  dOb: Date;

  @IsOptional()
  @ApiProperty({ description: 'This is the users avatar', default: 'Nthttps://www.cobdoglaps.sa.edu.au/wp-content/uploads/2017/11/placeholder-profile-sq.jpgwari' })
  avatar: string;

  @ApiProperty({ description: 'This is the user gender', default: 'MALE' })
  @IsNotEmpty()
  @IsIn(['MALE','FEMALE','OTHER'])
  gender: 'MALE'|'FEMALE'|'OTHER';

  @IsOptional()
  @IsArray()
  organisation:Organisation[];

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

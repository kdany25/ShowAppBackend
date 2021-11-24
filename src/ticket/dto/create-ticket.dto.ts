/* eslint-disable prettier/prettier */
import { ApiProperty} from '@nestjs/swagger';
import { IsDate, IsNotEmpty, IsNumber, IsString, } from 'class-validator';
import { Event } from 'src/event/entities/event.entity';
import { User } from 'src/user/entities/user.entity';

export class CreateTicketDto {
 
  @IsString()
  @ApiProperty({
    description: 'this is seat category ',
    default: 'VVIP',
  })
  seatCategory: string;

  @IsNumber()
  @ApiProperty({
    description: 'price of ticket ',
    default: 5000,
  })
  price: number;
  @ApiProperty({
    description: 'date ticket created has been created',
    default: new Date(),
  })
  createdAt: Date;
}

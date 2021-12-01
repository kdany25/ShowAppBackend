import { ApiProperty} from '@nestjs/swagger';
import { IsDate, IsNotEmpty, IsNumber, IsString, } from 'class-validator';


export class CreateTicketDto {
 
  @IsString()
  @ApiProperty({
    description: 'this is seat category ',
    default: 'VVIP',
  })
  seatCategory: string;
@IsNumber()
  @ApiProperty({
    description: 'quantity of ticket ',
    default: 1,
  })
  ticket_quantity : number
  @IsNumber()
  @ApiProperty({
    description: 'price of ticket ',
    default: 5000,
  })
  price: number;

   @IsString()
  @ApiProperty({
    description: 'this is seat number ',
    default: '34',
    
  })
  seat_number: string
  
  
  @ApiProperty({
    description: 'date ticket created has been created',
    default: new Date(),
  })
  createdAt: Date;

 


}

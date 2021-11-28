import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';
import { CreateTicketDto } from './create-ticket.dto';

export class UpdateTicketUsedDto extends PartialType(CreateTicketDto) {

  @IsBoolean()
  @ApiProperty({
    description: 'ticket can be refunded ',
    default: false,
  })
  used : boolean;
}

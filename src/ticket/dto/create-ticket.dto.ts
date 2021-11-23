import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length, MaxLength } from 'class-validator';
import { Event } from 'src/event/entities/event.entity';
import { User } from 'src/user/entities/user.entity';

export class CreateTicketDto {
  id: string;

  seatCategory: string;

  price: number;

  createdAt: Date;

  event: Event;

  user: User;
}

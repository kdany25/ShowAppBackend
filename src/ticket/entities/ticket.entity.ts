import { Event } from 'src/event/entities/event.entity';
import { User } from 'src/user/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('tickets')
export class Ticket {
  id: string;

  seatCategory: string;

  price: number;

  createdAt: Date;

  refund: boolean;

  event: Event;

  user: User;
}

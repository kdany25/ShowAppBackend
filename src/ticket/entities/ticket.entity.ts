/* eslint-disable prettier/prettier */
import { type } from 'os';
import { Event } from 'src/event/entities/event.entity';
import { User } from 'src/user/entities/user.entity';
import { Column, CreateDateColumn, Entity,  ManyToOne,  PrimaryGeneratedColumn } from 'typeorm';

@Entity('tickets')
export class Ticket {
  @PrimaryGeneratedColumn('uuid')
  id: string;
   
  @Column({ nullable: false })
  seatCategory: string;
  
  @Column({ nullable: false })
  price: number;

 @CreateDateColumn({
    type: 'timestamptz',
    default: 'NOW()',
  })
  createdAt: Date;
 
   @Column({ nullable: false , default: true })
  refund: boolean;

  @ManyToOne((type) => Event , (ticket)=> ticket.tickets)
  event: Event;

  @ManyToOne((type) => User , (ticket) => ticket.tickets)
  user: User;
}

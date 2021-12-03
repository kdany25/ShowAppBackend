import { Event } from '../../event/entities/event.entity';
import { User } from '../../user/entities/user.entity';
import { Column, CreateDateColumn, Entity,  ManyToOne,  PrimaryGeneratedColumn } from 'typeorm';

@Entity('tickets')
export class Ticket {
  @PrimaryGeneratedColumn('uuid')
  id: string;
   
  @Column({ nullable: false })
  seatCategory: string;

  @Column({nullable : false , default:1})
  ticket_quantity  : number;
  
  @Column({ nullable: false })
  price: number;

  @Column({nullable:true})
  seat_number : string

  @Column({ nullable: false , default: false })
  refund: boolean;


  @Column({ nullable: false , default: false })
  used: boolean;

  @CreateDateColumn({
    type: 'timestamptz',
    default: 'NOW()',
  })
  createdAt: Date;
 
  @ManyToOne((type) => Event , (event)=> event.tickets , {cascade:true} )
  event: Event;

  @ManyToOne((type) => User , (user) => user.tickets , {cascade:true})
  user: User;
}

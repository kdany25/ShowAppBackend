/* eslint-disable prettier/prettier */
import { Event } from "src/event/entities/event.entity";
import { User } from "src/user/entities/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('tickets')
export class Ticket {

    @PrimaryGeneratedColumn('uuid')
    id:string;

    @Column({nullable:false})
    seatCategory:string;

    @Column({ nullable:false })
    price:number;

    @Column({nullable:false})
    createdAt:Date;

    
    @ManyToOne(()=>Event,(event)=>event.tickets)
    event:Event;
    
    @ManyToOne(()=>User,(user)=>user.tickets)
    user:User;
    
    
}

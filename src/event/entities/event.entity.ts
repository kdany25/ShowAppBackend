/* eslint-disable prettier/prettier */
import { Organisation } from "src/organisation/entities/organisation.entity";
import { Ticket } from "src/ticket/entities/ticket.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('events')
export class Event {

    @PrimaryGeneratedColumn('uuid')
    eventId:string;

    @Column({nullable:false})    
    title:string;

    @Column({nullable:false,default:'https://www.cobdoglaps.sa.edu.au/wp-content/uploads/2017/11/placeholder-profile-sq.jpg'})
    thumbnail:string;

    @Column({nullable:false})
    description:string;

    @Column({nullable:false})
    eventDate:Date;

    @Column({nullable:false})
    eventHour:Date

    @Column({nullable:false})
    isPublished:boolean;

    @Column({nullable:false})
    eventCategory:string;

    @Column({nullable:true})
    vvipAvailabelSeats:string;

    @Column({nullable:true})
    vvipPrice:string;


    @Column({nullable:true})
    vipAvailabelSeats:string;

    @Column({nullable:true})
    vipPrice:string;;

    @Column({nullable:true})
    regularAvailabelSeats:string;

    @Column({nullable:true})
    regularPrice:string;

    @ManyToOne(()=>Organisation,(organisation)=>organisation.events )
    organisation:Organisation;

    @OneToMany(()=>Ticket,(ticket)=>ticket.event)
    tickets:Ticket[];

}

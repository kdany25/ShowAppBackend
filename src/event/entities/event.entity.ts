import { Transform } from "class-transformer";
import { Organisation } from "../../organisation/entities/organisation.entity";
import { Ticket } from "../../ticket/entities/ticket.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, Timestamp, Unique } from "typeorm";

@Entity('events')
export class Event {
   
    @PrimaryGeneratedColumn('uuid')
    eventId:string;

    @Column({nullable:false,unique:true})
    eventCode:string;
   
    @Column({nullable:false})    
    title:string;

    @Column({nullable:false,default:'https://www.cobdoglaps.sa.edu.au/wp-content/uploads/2017/11/placeholder-profile-sq.jpg'})
    thumbnail:string;

    @Column({nullable:false})
    description:string;

    @Column({nullable:true,type: 'timestamptz'})
    eventStartDate:Date;

    @Column({nullable:true,type: 'timestamptz'})
    eventEndDate:Date;

    @Column({nullable:true,type: 'time'})
    startHour:Date

    @Column({nullable:true,type: 'time'})
    endHour:Date

    @Column({nullable:false})
    isPublished:boolean;

    @Column({nullable:true,default:'STARTED'})
    status:string;

    @Column({nullable:true,default:false})
    isDeleted:boolean;

    @Column({nullable:false})
    eventCategory:string;

    @Column({nullable:true})
    vvipAvailabelSeats:number;

    @Column({nullable:true})
    vvipPrice:number;

    @Column({nullable:true})
    vipAvailabelSeats:number;

    @Column({nullable:true})
    vipPrice:number;

    @Column({nullable:true})
    regularAvailabelSeats:number;

    @Column({nullable:true})
    regularPrice:number;

    @Column({nullable:true})
    isCanceled:boolean;

    @ManyToOne(()=>Organisation,(organisation)=>organisation.events,{
    })
    organisation:Organisation;

    @OneToMany(()=>Ticket,(ticket)=>ticket.event,{
        onDelete:'CASCADE'
        
    })
    tickets:Ticket[];

}

/* eslint-disable prettier/prettier */
import { Event } from "src/event/entities/event.entity";
import { User } from "src/user/entities/user.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('organisations')
export class Organisation {
    @PrimaryGeneratedColumn('uuid')
    organisationId:string;

    @Column({nullable:false})
    name:string;
    
    @Column({nullable:false,default:''})
    avatar:string;

    @Column({nullable:false})
    description:string;

    @Column({nullable:false})
    address:string;

    @ManyToOne(()=>User,(user)=>user.organisation)
    user:User;

    @OneToMany(()=>Event,(event)=>event.organisation)
    event:Event;

}

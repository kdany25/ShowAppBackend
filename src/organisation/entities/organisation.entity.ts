/* eslint-disable prettier/prettier */
import { Event } from "src/event/entities/event.entity";
import { User } from "src/user/entities/user.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('organisations')
export class Organisation {
    @PrimaryGeneratedColumn('uuid')
    organisationId:string;

    @Column({nullable:false,unique:true})
    name:string;

    @Column({nullable : true,unique:true})
    email : string
    
    @Column({nullable:false,default:''})
    avatar:string;

    @Column({nullable:false})
    description:string;

    @Column({nullable:false})
    address:string;

    @ManyToOne(()=>User,(user)=>user.organisation,{cascade:true,eager:true})
    user:User;

    @OneToMany(()=>Event,(event)=>event.organisation,{cascade:true})
    events:Event[];

}

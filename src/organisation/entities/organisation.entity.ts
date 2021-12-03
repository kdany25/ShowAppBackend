import { Event } from "src/event/entities/event.entity";
import { Status } from "src/shared/interfaces";
import { User } from "src/user/entities/user.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('organisations')
export class Organisation {
    @PrimaryGeneratedColumn('uuid')
    organisationId:string;

    @Column({nullable:false,unique:false})
    name:string;

    @Column({nullable : true,unique:true})
    email : string
    
    @Column({nullable:false,default:''})
    avatar:string;

    @Column({nullable:false})
    description:string;

    @Column({nullable:false})
    address:string;

    @Column({
        type: 'enum',
        enum: Status,
        default: Status.ACTIVE,
      })
      status: Status;

    @ManyToOne(()=>User,(user)=>user.organisation,{cascade:true,eager:true})
    user:User;

    @OneToMany(()=>Event,(event)=>event.organisation,{cascade:true})
    events:Event[];

}

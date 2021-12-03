/* eslint-disable prettier/prettier */
import { Organisation } from 'src/organisation/entities/organisation.entity';
import { RequestRoleChange } from 'src/request-role-change/entities/request-role-change.entity';
import { Ticket } from 'src/ticket/entities/ticket.entity';
import { Column, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
@Entity('users')
export class User {
    @PrimaryGeneratedColumn('uuid')
    userId? :string;

    @Column({nullable : false})
    firstName : string;

    @Column({nullable : false})
    lastName : string;

    @Column({nullable : false})
    email : string;

    @Column({nullable:false,type:'enum',enum:['USER','ORGANISER','ADMIN'],default:'USER'})
    role?:'USER'|'ORGANISER'|'ADMIN';

    @Column({nullable : false})
    password : string;

    @Column({nullable : false})
    phone : string;

    @Column({nullable : false,default:false})
    isVerified? : boolean;

    @Column({nullable : false,default:"active"})
    status? : string;

    @Column({nullable : false})
    dOb : Date;

    @Column({nullable : false,default:'https://www.cobdoglaps.sa.edu.au/wp-content/uploads/2017/11/placeholder-profile-sq.jpg'})
    avatar : string;

    @Column({ type: 'enum', enum: ['MALE', 'FEMALE', 'OTHER'], nullable: true })
    gender : 'MALE'|'FEMALE'|'OTHER';

    @OneToMany(()=>Organisation,(organisation)=>organisation.user)
    organisation:Organisation[];

    @OneToMany(()=>Ticket,(ticket)=>ticket.user)
    tickets:Ticket[];

    // @OneToOne(() => RequestRoleChange,(request) => request.user)
    // request?:RequestRoleChange
}

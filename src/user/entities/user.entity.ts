/* eslint-disable prettier/prettier */
import { Organisation } from 'src/organisation/entities/organisation.entity';
import { Ticket } from 'src/ticket/entities/ticket.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
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

    @Column({nullable : false})
    dOb : Date;

    @Column({nullable : false,default:'https://www.cobdoglaps.sa.edu.au/wp-content/uploads/2017/11/placeholder-profile-sq.jpg'})
    avatar : string;

    @Column({ type: 'enum', enum: ['MALE', 'FEMALE', 'OTHER'], nullable: false })
    gender : 'MALE'|'FEMALE'|'OTHER';

    @OneToMany(()=>Organisation,(organisation)=>organisation.user)
    organisation:Organisation[];

    @OneToMany(()=>Ticket,(ticket)=>ticket.user)
    tickets:Ticket[];
}

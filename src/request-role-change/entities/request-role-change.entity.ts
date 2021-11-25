import { User} from 'src/user/entities/user.entity'
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('requests')


export class RequestRoleChange {

  @PrimaryGeneratedColumn('uuid')
  requestId?: string;

  @Column({ nullable: false, default: false })
  isApproved: boolean;

  @Column({ nullable: false, default: "Request to change role to organiser" })
  type: string;

  @OneToOne(() => User, { cascade: true, eager: true})
  @JoinColumn({ name: 'userId' })
  user: User;


}

/* eslint-disable prettier/prettier */
import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Event } from '../event/entities/event.entity';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { Ticket } from './entities/ticket.entity';
import { from, Observable } from 'rxjs';
import  { toDataURL } from 'qrcode';
import { JwtPayload } from 'src/shared/interfaces';
import { UserService } from 'src/user/user.service';
import { EventService } from 'src/event/event.service';


@Injectable()
export class TicketService {
 
  constructor( 
    
    @InjectRepository(User) private userrepo: Repository<User>, @InjectRepository(Event) private eventrepo: Repository<Event>,@InjectRepository(Ticket) private ticketrepo: Repository<Ticket>,private userServices:UserService , private eventservice :EventService){}


public  async create(createTicketDto: CreateTicketDto, eventId:string ,user)  {
  try {
   
    
     // return {...createTicketDto, user, ...event}
// const tic = {...createTicketDto, user,eventt}
return await this.ticketrepo.save({...createTicketDto ,eventId,user})
  } catch (error) {
    
    throw new HttpException(error,HttpStatus.BAD_REQUEST)
  }
   
}

  findAll(): Observable<Ticket[]>{


    return from (this.ticketrepo.find());
  }


  findOne(id: string) : Observable<Ticket> {
    return from (this.ticketrepo.findOne(id));
  }

  update(id: string, updateTicketDto: UpdateTicketDto) {
    return from(this.ticketrepo.update(id,updateTicketDto));
  }

  remove(id: number )  {
    return `This action removes a #${id} ticket`;
  }

  async generate(id: string){
    try {
      const ticket = this.ticketrepo.findOne(id)
      const res = JSON.stringify(ticket);
      const q = toDataURL(res);
      return q;
    } catch (error) {
      return console.error(error)
      
    }
  }
  async check (id : string){

    try {
       const check = this.ticketrepo.findOne({id:id,refund:false}); 
       if (check)
        return check;
       if(!check) {
         return 'Ticket has been refunded'
       } 
    } catch (error) {
      console.log(error)
    }
  }
   async validateUser(payload: JwtPayload): Promise<User> {
    const user = await this.userServices.findOne(payload.userId);
    if (!user) throw new UnauthorizedException('Invalid token');
    return user;
  }

}

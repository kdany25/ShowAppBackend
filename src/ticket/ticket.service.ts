import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Event } from '../event/entities/event.entity';
import { User } from '../user/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { Ticket } from './entities/ticket.entity';
import { from, Observable } from 'rxjs';
import { toDataURL } from 'qrcode';
import { JwtPayload } from '../shared/interfaces';
import { UserService } from '../user/user.service';
import { EventService } from '../event/event.service';
import { UpdateTicketUsedDto } from './dto/update-used-dto';


@Injectable()
export class TicketService {
 
constructor( 
@InjectRepository(User) private userrepo: Repository<User>,
@InjectRepository(Event) private eventrepo: Repository<Event>,
@InjectRepository(Ticket) private ticketrepo: Repository<Ticket>,
private userServices:UserService , private eventservice :EventService){}

  //create ticket
  public async create(createTicketDto: CreateTicketDto, eventId:string ,user)  {
  try {
   const dt = createTicketDto;
   dt.price = dt.price* dt.ticket_quantity
   return await this.ticketrepo.save({...dt,eventId,user})
    } catch (error) {
   throw new HttpException(error,HttpStatus.BAD_REQUEST)
  }
  }
   
  //Get all ticket
  findAll(): Observable<Ticket[]>{
  return from (this.ticketrepo.find());
  }


  //Get ticket By Id
  findOne(id: string) : Observable<Ticket> {
    return from (this.ticketrepo.findOne(id));
  }
 
  //Update Ticket details
  update(id: string, updateTicketDto: UpdateTicketDto) {
    return from(this.ticketrepo.update(id,updateTicketDto));
  }
  
  //delete ticket
  remove(id: number )  {
    return `This action removes a #${id} ticket`;
  }

  //Generate QRCode for ticket
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
   //Checking ticket if is valid 
  async check (id : string , updateTicketUsedDto: UpdateTicketUsedDto){
    
    try {
      const check = this.ticketrepo.findOne({id:id,refund:false , used:false});
      if(check) {
      this.ticketrepo.update(id,updateTicketUsedDto) 
      } else 
      return 'ticked has already used '
    } catch (error) {
      throw new HttpException(error,HttpStatus.BAD_REQUEST)
    }
   }

  // validate user 
  async validateUser(payload: JwtPayload): Promise<User> {
  const user = await this.userServices.findOne(payload.userId);
  if (!user) throw new UnauthorizedException('Invalid token');
    return user;
  }

  }

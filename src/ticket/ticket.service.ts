import { ForbiddenException, HttpException,
         HttpStatus,
         Injectable,
         UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Event } from '../event/entities/event.entity';
import { User } from '../user/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { Ticket } from './entities/ticket.entity';
import { from, Observable } from 'rxjs';
import { toDataURL } from 'qrcode';
import { JwtPayload } from 'src/shared/interfaces';
import { UserService } from 'src/user/user.service';
import { EventService } from 'src/event/event.service';
import * as SendGrid from '@sendgrid/mail';


@Injectable()
export class TicketService {
 
constructor( 
@InjectRepository(User) private userrepo: Repository<User>,
@InjectRepository(Event) private eventrepo: Repository<Event>,
@InjectRepository(Ticket) private ticketrepo: Repository<Ticket>,
private userServices:UserService ,
private eventservice :EventService){}

  //create ticket
  public async create(createTicketDto: CreateTicketDto,eventId:string,user)  {                   
  try {
  const dt = createTicketDto;
  const tic = []
  for( let i=0 ;i<dt.ticket_quantity ;i++){ 
  const result = await this.ticketrepo.save({
      ...dt,
      ticket_quantity: 1,
      eventId,
      user})

      tic.push(result);
  }
  return tic
       }
  catch (error) {
  throw new HttpException(error,HttpStatus.BAD_REQUEST)
  }
  }

  //Get all ticket
  findAll(): Observable<Ticket[]>{
  return from (this.ticketrepo.find());
  }

  //Get ticket By Id
  async findOne(id: string , User) : Promise<Ticket> {
   const checkowner = await this.validateOwnership(id,User)
   if (!checkowner) throw new ForbiddenException('this ticket does not belong to you')
  return await this.ticketrepo.findOne(id);
  }
 
  //Update Ticket details
  update(id: string, updateTicketDto: UpdateTicketDto) {
  return from(this.ticketrepo.update(id,updateTicketDto));
  }
  
  //delete ticket
  remove(id: string )  {
  return this.ticketrepo.delete(id);
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
  async check (id : string ) : Promise<any> {
    
    try {
      const check =  await this.ticketrepo.findOne({id:id,refund:false , used:false});
      console.log(check)
      if(!check) {
         return 'ticked has already used '
      } else {
            
           this.ticketrepo.save({...check,used:true})
           return 'Welcome'
      }
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
  // email sender function
  sendTicketMail(userEmail: string ,
                 seatC : string ,
                 price : number ,
                 seatN : string ,
                 fName:string ,
                 sName:string ) {
  const data = {
      template:"d-d62e8fc27ce4463f80ed4b795b21cfa9", 
                 }
  const mailContent = {
      to: userEmail,
      from: process.env.EMAIL_SENDER,
      templateId: data.template,
      dynamic_template_data:{
        preheader : 'hello from ShowApp',
        subject: 'ticket details',
        name: fName,
        surname : sName,
        userEmail : userEmail,
        seat_Category: seatC,
        price: price,
        Seat_Number: seatN,
      }
    }
  SendGrid.setApiKey(process.env.SENDGRID_API_KEY)
  const transport = SendGrid.send(mailContent)
  return transport
      }

  // checking the ownership of ticket
  async validateOwnership(ticketid: any,user:User):Promise<boolean> {
  if(user.role=="USER"){
      const org = await this.ticketrepo.findOne({
          where:{
          id:ticketid,
          user
          }
          });
       return org?true:false
      }
  return true
  }

     }

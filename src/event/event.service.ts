import { HttpException, HttpStatus, Injectable, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { from, Observable } from 'rxjs';
import { OrganisationService } from '../organisation/organisation.service';
import { JwtPayload } from '../shared/interfaces';
import { User } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { Event } from './entities/event.entity';
import { EventRepository } from './event.repository';

@Injectable()
export class EventService {
  private logger=new Logger('EventService');
  constructor(
    @InjectRepository (EventRepository)
    private   eventRepository: EventRepository,
    private jwtService:JwtService,
    private organisationService:OrganisationService,
    private userService:UserService
  ){}

  /** Service: Create/Register an event
   *
   * @param CreateEventDto create event
   * @param organisatinId string
   * @param userRequest string
   * @returns Promise<{createEventDto:CreateEventDto }>
   */

  public async create(createEventDto: CreateEventDto,organisatinId:string,userRequest:string): Promise<Event> {
    this.validateEvent(createEventDto);
    const organisation= await this.organisationService.findById(organisatinId);
    const user=await this.userService.findOne(userRequest);
    if(!user) throw new NotFoundException('user not found');
    if(!organisation) throw new NotFoundException('organisation not found');
    if((organisation.user.role==='USER') ||(userRequest!=organisation.user.userId)) throw new UnauthorizedException('Unmatch role for create only organisation');

      this.logger.log(`event is created `);
      const eventCode=this.randomString();
     return await this.eventRepository.save({...createEventDto,eventCode,organisation});
    
  }

  /** Service: get all events
   * 
   * @returns Observable<[createEventDto:CreateEventDto ]>
   */
  public async findAll(): Promise<Event[]> {
    this.logger.log(`retrieve all events`);
    const events=await this.eventRepository.find({where:[{isDeleted:false}]});
    if(events.length<0) throw new NotFoundException('not data found ');
    return events; 
    
  }
  
  /** Service: search  an event by title
   *
   * @param title string
   * @returns Promise<[createEventDto:CreateEventDto ]>
   */
  public async searchEvent(key:string): Promise<Event[]>{
    this.logger.log(`searching event by key : ${key}`);
    return await this.eventRepository.searchEvent(key);
  }

  /** Service: retrieve  a particular event
   *
   * @param id event Id 
   * @returns Observable<{event:Event }>
   */
  findOne(id: string):Observable<Event> {
    this.logger.log(`get single event by Id ${id}`);
    const event=this.eventRepository.finById(id);
    if(!event) throw new NotFoundException('event not found');
    return from(this.eventRepository.findOne({
      where:[{eventId:id}]
    }));
  }

   /** Service: Update particular event 
   * @param id string 
   * @param updateEventDto UpdateEventDto
   * @returns Promise<{event:Event}>
   */
  public async update(id: string, updateEventDto: UpdateEventDto,userRequest:string):Promise<Event> {
        const event=await this.eventRepository.findOne(id);
        const org=await this.organisationService.findById(event.organisation.organisationId);
        
        if(!event) throw new NotFoundException ('event not found ');
        if((org.user.role==='USER') ||(userRequest!=event.organisation.user.userId)) throw new UnauthorizedException('Unmatch role for update');
        this.validateEvent(updateEventDto);
        this.logger.log(`update event with id :${id} and updated Event ${updateEventDto} :`)
        return this.eventRepository.editProduct(id,updateEventDto);
  }

  /** Service: get events Created By Organisation 
   * @param id string 
   * @returns Observables<{event:Event}>
   */
  async getEventByOrganisationId(id:string){
    this.logger.log(`retrieve event owned by organisation id :${id}`);
    const organisation= await this.organisationService.findById(id);
    if(!organisation) throw new NotFoundException('Organisation not found');
    if(organisation.user.role!=='ORGANISER') throw new UnauthorizedException('user is not organiser');
    const event=this.eventRepository.find({where:{organisation:id}});
    const events=(await event).map((org)=>{
      if(org.organisation.organisationId===organisation.organisationId){
        return org;
      }
    })
    return events;
   
  }

   /** Service: Delete an event 
   * @param id string 
   * @returns Promise<{message: string}>
   */
  public async remove(id: string,userId:string):Promise<string> {
     const event= await this.eventRepository.findOne(id)
        if(!event) throw new NotFoundException (`event ${id} not found`);
        if(event.organisation.user.role==='USER') throw new UnauthorizedException('user is not organiser');
        const organisations=this.organisationService.getOrganisationsByUserId(userId);
        const allowed=(await organisations).map((org)=>{
          if(org.organisationId===event.organisation.organisationId)return org;
        })

        if(allowed){
          this.logger.log(`remove event by id:${id}`);
          await this.eventRepository.deleteEvent(id)
        return  "deleted success";

        }else{
          throw new UnauthorizedException('limited grants for actions');
        }
  }

  

  /** Service:  cancel  a particular event
   *
   * @param id string 
   *  @param updateEventDto UUpdateEventDto
   * @returns Promise<{event:Event }>
   */
  public async cancelEvent(id: string, updateEventDto: UpdateEventDto,userId:string):Promise<Event> {
    const event= await this.eventRepository.findOne(id)
    if(!event) throw new NotFoundException ('event not found');
    if(event.organisation.user.role==='USER') throw new UnauthorizedException("event must be canceled by it's organiser ")
    const organisations=this.organisationService.getOrganisationsByUserId(userId);
        const allowed=(await organisations).map((org)=>{
          if(org.organisationId===event.organisation.organisationId)return org;
        })
        if(allowed){
          this.logger.log(`cancel event by id:${id}`);
          return this.eventRepository.cancelEvent(id,updateEventDto);

        }else{
          throw new UnauthorizedException('limited grants for actions ');
        }
  }

   /** Service:  validate a particular user
   *
   * @param payload JWTPayload 
   *  @param updateEventDto UUpdateEventDto
   * @returns Promise<{event:Event }>
   */
  async validateUser(payload: JwtPayload): Promise<User> {
    const user = await this.userService.findOne(payload.userId);
    if (!user) throw new UnauthorizedException('Invalid token');
    return user;
  }

 

   /** Service:  validate a created event hours and dates
   *
   * @param createEventDto any 
   * 
   * @returns Boolean
   */
   private validateEvent(createEventDto:any):boolean{
    const { startHour, endHour, eventStartDate, eventEndDate }=createEventDto;
    const customDate='01/01/2000';
    const currentDate=new Date(Date.now());
    currentDate.setHours(0,0,0,0);
    const sDate=new Date(eventStartDate);
    const eDate=new Date(eventEndDate);
    const sHour=new Date(customDate.concat(startHour) );
    const eHour=new Date(customDate.concat(endHour));
    if(sDate.getTime()<currentDate.getTime()){
      throw new HttpException('event start date must be in future',HttpStatus.FORBIDDEN);
    }
    if(eDate.getTime()<sDate.getTime()){
      throw new HttpException('event end date must be greater the start date',HttpStatus.FORBIDDEN);
    }
    if(sDate.getTime()===eDate.getTime() && sHour >= eHour){
      throw new HttpException('event end hour must be greater the start hour',HttpStatus.FORBIDDEN);
    }
    return true;

  }

    /** Service:  generate eventCode
   *
   * @returns string
   */
  private  randomString():string {

		const characters= '0123456789';
		let str = "";
		 const createdEmplCode="EV";
		const mynewCharacters = characters.split('');
		const generatedCodeLength =4;
		for (let i = 0; i < generatedCodeLength; i++) {
		    const index:number = (Math.random() *10);
		    const newString:string = characters.substring(index, characters.length - 1);
		    str += mynewCharacters[newString.length];
		}
		return createdEmplCode.concat(str);
	    }

}

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
      this.logger.log(`event is created `);
     return await this.eventRepository.save({...createEventDto,organisation});
    
  }

  /** Service: get all events
   * 
   * @returns Observable<[createEventDto:CreateEventDto ]>
   */
  public async findAll(): Promise<Event[]> {
    this.logger.log(`retrieve all events`);
    return await this.eventRepository.find({});
  }
  
  /** Service: search  an event by title
   *
   * @param title string
   * @returns Promise<[createEventDto:CreateEventDto ]>
   */
  public async getByTitle(title:string): Promise<Event[]>{
    this.logger.log(`searching event by title : ${title}`);
    return await this.eventRepository.findByTitle(title);
  }

  /** Service: retrieve  a particular event
   *
   * @param id event Id 
   * @returns Observable<{event:Event }>
   */
  findOne(id: string):Observable<Event> {
    this.logger.log(`get single event by Id ${id}`)
    return from(this.eventRepository.findOne(id));
  }

   /** Service: Update particular event 
   * @param id string 
   * @param updateEventDto UpdateEventDto
   * @returns Promise<{event:Event}>
   */
  public async update(id: string, updateEventDto: UpdateEventDto):Promise<Event> {
        const event= await this.eventRepository.findOne(id)
        if(!event) throw new NotFoundException ('event not found ');
        this.validateEvent(updateEventDto);
        this.logger.log(`update event with id :${id} and updated Event ${updateEventDto} :`)
        return this.eventRepository.editProduct(id,updateEventDto);
  }

  /** Service: get events Created By Organisation 
   * @param id string 
   * @returns Observables<{event:Event}>
   */
  getEventByOrganisationId(id:string){
    this.logger.log(`retrieve event owned by organisation id :${id}`)
    return this.eventRepository.find({where:{organisation:id}});
   
  }

   /** Service: Delete an event 
   * @param id string 
   * @returns Promise<{message: string}>
   */
  public async remove(id: string):Promise<void> {
    const event= await this.eventRepository.findOne(id)
        if(!event) throw new NotFoundException (`event ${id} not found`);
        this.logger.log(`remove event by id:${id}`);
    return  await this.eventRepository.deleteEvent(id);
  }

  

  /** Service:  cancel  a particular event
   *
   * @param id string 
   *  @param updateEventDto UUpdateEventDto
   * @returns Promise<{event:Event }>
   */
  public async cancelEvent(id: string, updateEventDto: UpdateEventDto):Promise<Event> {
    const event= await this.eventRepository.findOne(id)
    if(!event) throw new NotFoundException ('event not found');
    this.logger.log(`cancel event by id:${id}`);
    return this.eventRepository.cancelEvent(id,updateEventDto);
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

}

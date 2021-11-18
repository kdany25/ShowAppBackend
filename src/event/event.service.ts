import {HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { from, Observable } from 'rxjs';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { Event } from './entities/event.entity';
import { EventRepository } from './event.repository';

@Injectable()
export class EventService {
  constructor(
    @InjectRepository (EventRepository)
    private   eventRepository: EventRepository
  ){}

  public  create(createEventDto: CreateEventDto): Observable<Event> {
    try{
        return from(this.eventRepository.save(createEventDto));
    }catch(err){
      throw new HttpException(err,HttpStatus.BAD_REQUEST);
    }
  }

  findAll(): Observable<Event[]> {
    return from(this.eventRepository.find())  ;
  }
  
  getByTitle(title:string): Observable<Event[]>{
    
    return from (this.eventRepository.findByTitle(title));
  }

  findOne(id: string):Observable<Event> {
    return from(this.eventRepository.findOne(id));
  }

  update(id: string, updateEventDto: UpdateEventDto) {
        const event=this.eventRepository.findOne(updateEventDto.eventId)
        if(event) throw new NotFoundException ('event not found');
        return from(this.eventRepository.update(id,updateEventDto));
  }

  getEventByOrganisationId(id:string){
    return this.eventRepository.find({where:{organisation:id}});
   
  }

  remove(id: string) {
    return this.eventRepository.delete(id);
  }
}

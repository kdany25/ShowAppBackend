import { InternalServerErrorException, Logger } from '@nestjs/common';
import { EntityRepository, getConnection, ILike, Repository } from 'typeorm';
import { UpdateEventDto } from './dto/update-event.dto';
import { Event } from './entities/event.entity';

@EntityRepository(Event)
export class EventRepository extends Repository<Event> {
  private logger=new Logger('EventRepository');
  /** Repo: search event by title
   * @param title the title 
   * @returns Events
   */

  searchEvent(title: string) {
    return this.find({
      where: [{ title: ILike(`%${title}%`),isDeleted:false },
      {eventCode:ILike(`%${title}%`)},
      {eventCategory:ILike(`${title}`)},
      {status:ILike(`${title}`)}
    
    ],
    });
  }

  public async finById(id:string):Promise<Event>{
    return this.findOne(id);
  }

   /** Repo: update event 
   * @param eventId string
   *  @param updateEventDto Updated event
   * @returns updated event
   */
  public async editProduct(
    eventId: string,
    updateEventDto: UpdateEventDto,
): Promise<Event> {
    const { title,thumbnail,description,eventStartDate,eventEndDate,startHour,endHour,isPublished,eventCategory,
    vvipAvailabelSeats,vvipPrice,vipAvailabelSeats,vipPrice,regularAvailabelSeats,regularPrice
    ,isCanceled
    } = updateEventDto;
    const event = await this.findOne({where:[{eventId,isDeleted:false}]});
    event.title =title;
    event.description = description;
    event.thumbnail =thumbnail;
    event.eventStartDate =eventStartDate;
    event.eventEndDate =eventEndDate;
    event.startHour =startHour;
    event.endHour =endHour;
    event.isPublished =isPublished;
    event.eventCategory =eventCategory;
    event.vvipAvailabelSeats =vvipAvailabelSeats;
    event.vvipPrice =vvipPrice;
    event.vipAvailabelSeats =vipAvailabelSeats;
    event.vipPrice =vipPrice;
    event.regularAvailabelSeats =regularAvailabelSeats;
    event.regularPrice =regularPrice;
    event.isCanceled =isCanceled;
    await this.save(event);
    try{
      return this.findOne(eventId);

    }catch(error){
      this.logger.error(`Failed to update event ${event.title}`);
      throw new InternalServerErrorException();
    }
}

 
 public async deleteEvent(eventId:string):Promise<void>{
    const event = await this.findOne(eventId);
    if(!event.isDeleted){
      
      await getConnection()
      .createQueryBuilder()
      .update(Event)
      .set({isDeleted:true})
      .where("eventId= :eventId",{eventId})
      .execute();
    }

  }

  public async cancelEvent(
    eventId: string,
    updateEventDto: UpdateEventDto,
): Promise<Event> {
    const { isCanceled } = updateEventDto;
    const event = await this.findOne({where:[{eventId,isDeleted:false}]});
    event.isCanceled = isCanceled;
    
    await this.save(event);

    return event;
}
}

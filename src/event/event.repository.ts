import { EntityRepository, ILike, Repository } from 'typeorm';
import { UpdateEventDto } from './dto/update-event.dto';
import { Event } from './entities/event.entity';

@EntityRepository(Event)
export class EventRepository extends Repository<Event> {

  /** Repo: search event by title
   * @param title the title 
   * @returns Events
   */

  findByTitle(title: string) {
    return this.find({
      where: [{ title: ILike(`%${title}%`) }],
    });
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
    const event = await this.findOne(eventId);
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

    return event;
}

 
 public async deleteEvent(eventId:string):Promise<void>{
    const event = await this.findOne(eventId);
    await this.remove(event);

  }

  public async cancelEvent(
    eventId: string,
    updateEventDto: UpdateEventDto,
): Promise<Event> {
    const { isCanceled } = updateEventDto;
    const event = await this.findOne(eventId);
    event.isCanceled = isCanceled;
    
    await this.save(event);

    return event;
}
}

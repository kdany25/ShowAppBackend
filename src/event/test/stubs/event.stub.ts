import { Organisation } from '../../../organisation/entities/organisation.entity'
import { Ticket } from '../../../ticket/entities/ticket.entity'
import { Event } from '../../entities/event.entity'
export const eventStub= (): Event =>{
  return {
    eventId:'0c3a2147-6256-4548-b0fb-ec7b9b3772f7',
    title: 'kubah6',
    thumbnail: 'no image yoh',
    description: 'this is a good feature and the event is created this is a good feature and the event is created',
    eventStartDate: new Date('2021-11-24T22:00:00.000Z'),
    eventEndDate: new Date('2021-12-15T22:00:00.000Z'),
    startHour: new Date('13:43'),
    endHour:new Date('23:11'),
    isPublished: true,
    eventCategory: "POLITICS",
    vvipAvailabelSeats: 50,
    vvipPrice: 20000,
    vipAvailabelSeats: 120,
    vipPrice: 5000,
    regularAvailabelSeats: 1000,
    regularPrice: 3000,
    isCanceled: false,
    eventCode:'EV1235',
    status:'STARTED',
    isDeleted:false,
    organisation:new Organisation(),
    tickets:[new Ticket(),new Ticket()]
  }
}
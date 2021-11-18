import { EntityRepository, ILike, Repository } from 'typeorm';
import { Event } from './entities/event.entity';

@EntityRepository(Event)
export class EventRepository extends Repository<Event> {
  findByTitle(title: string) {
    return this.find({
      where: [{ title: ILike(`%${title}%`) }],
    });
  }
}

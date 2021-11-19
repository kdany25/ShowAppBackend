import { Module } from '@nestjs/common';
import { TicketService } from './ticket.service';
import { TicketController } from './ticket.controller';
import { Event } from 'src/event/entities/event.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Organisation } from 'src/organisation/entities/organisation.entity';
import { User } from 'src/user/entities/user.entity';
import { Ticket } from './entities/ticket.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Ticket, Organisation, Event])],
  controllers: [TicketController],
  providers: [TicketService],
})
export class TicketModule {}

import { Module } from '@nestjs/common';
import { EventService } from './event.service';
import { EventController } from './event.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventRepository } from './event.repository';

@Module({
  imports: [TypeOrmModule.forFeature([EventRepository])],
  controllers: [EventController],
  providers: [EventService],
  exports: [],
})
export class EventModule {}

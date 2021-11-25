import { Module } from '@nestjs/common';
import { EventService } from './event.service';
import { EventController } from './event.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventRepository } from './event.repository';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([EventRepository]),
    JwtModule.register({
      secret:process.env.SECRET,
      signOptions:{
        expiresIn:process.env.EXPIREIN
      }
    })
  ],
  controllers: [EventController],
  providers: [EventService],
  exports: [],
})
export class EventModule {}

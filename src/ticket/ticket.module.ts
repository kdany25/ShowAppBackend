/* eslint-disable prettier/prettier */
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TicketService } from './ticket.service';
import { TicketController } from './ticket.controller';
import { Event } from 'src/event/entities/event.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Ticket } from './entities/ticket.entity';
import { UserModule } from 'src/user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LoggerMiddleware } from 'src/utils/logger.middleware';
import { EventModule } from 'src/event/event.module';

@Module({
  imports: [UserModule,EventModule,
    TypeOrmModule.forFeature([User, Ticket, Event]),
    JwtModule.register({
      secret: process.env.SECRET,
      signOptions: {
        expiresIn: process.env.EXPIREIN,
      },
    }),
    PassportModule.register({
      defaultStrategy: 'jwt',
      property: 'user',
      session: false,
    }),

  ],
  controllers: [TicketController],
  providers: [TicketService,JwtStrategy],
})
export class TicketModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}

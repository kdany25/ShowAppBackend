/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from '../event/entities/event.entity';
import { EventModule } from '../event/event.module';
import { Organisation } from '../organisation/entities/organisation.entity';
import { OrganisationModule } from '../organisation/organisation.module';
import { Ticket } from '../ticket/entities/ticket.entity';
import { TicketModule } from '../ticket/ticket.module';
import { User } from '../user/entities/user.entity';
import { RequestRoleChange } from '../request-role-change/entities/request-role-change.entity';
import { RequestRoleChangeModule } from '../request-role-change/request-role-change.module'
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: parseInt(<string>process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DATABASE,
      entities: [User, Organisation, Event, Ticket, RequestRoleChange],
      synchronize: true,

    }),
    UserModule,
    OrganisationModule,
    EventModule,
    TicketModule ,
    RequestRoleChangeModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
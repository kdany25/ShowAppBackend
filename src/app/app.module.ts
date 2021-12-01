import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from 'src/event/entities/event.entity';
import { EventModule } from 'src/event/event.module';
import { Organisation } from 'src/organisation/entities/organisation.entity';
import { OrganisationModule } from 'src/organisation/organisation.module';
import { Ticket } from 'src/ticket/entities/ticket.entity';
import { TicketModule } from 'src/ticket/ticket.module';
import { User } from 'src/user/entities/user.entity';
import { RequestRoleChange } from 'src/request-role-change/entities/request-role-change.entity';
import { RequestRoleChangeModule } from 'src/request-role-change/request-role-change.module'
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: parseInt(<string>process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
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
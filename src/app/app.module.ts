import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from 'src/event/entities/event.entity';
import { EventModule } from 'src/event/event.module';
import { Organisation } from 'src/organisation/entities/organisation.entity';
import { OrganisationModule } from 'src/organisation/organisation.module';
import { Ticket } from 'src/ticket/entities/ticket.entity';
import { User } from 'src/user/entities/user.entity';
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
      database: process.env.POSTGRES_DATABASE,
      entities: [User,Organisation,Event,Ticket],
      synchronize: true,

    }),
    UserModule,
    OrganisationModule,
    EventModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
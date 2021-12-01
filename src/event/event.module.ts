import { Module } from '@nestjs/common';
import { EventService } from './event.service';
import { EventController } from './event.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventRepository } from './event.repository';
import { JwtModule } from '@nestjs/jwt';
import { OrganisationModule } from '../organisation/organisation.module';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from '../organisation/strategies/jwt.strategy';
import { UserModule } from '../user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([EventRepository]),
    JwtModule.register({
      secret:process.env.SECRET,
      signOptions:{
        expiresIn:process.env.EXPIREIN
      }
    }),
    OrganisationModule,UserModule,
    PassportModule.register({
      defaultStrategy: 'jwt',
      property: 'user',
      session: false,
    }),
  ],
  controllers: [EventController],
  providers: [EventService,JwtStrategy],
  exports: [EventService],
})
export class EventModule {}

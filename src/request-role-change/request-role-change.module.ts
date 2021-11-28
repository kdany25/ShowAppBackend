import { Module } from '@nestjs/common';
import { RequestRoleChangeService } from './request-role-change.service';
import { RequestRoleChangeController } from './request-role-change.controller';
import { RequestRoleChange } from './entities/request-role-change.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../user/user.module';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    UserModule,
    PassportModule.register({
      defaultStrategy: 'jwt',
      property: 'user',
      session: false,
    }),
    TypeOrmModule.forFeature([RequestRoleChange])],
    controllers: [RequestRoleChangeController],
    providers: [RequestRoleChangeService,JwtStrategy]
})
export class RequestRoleChangeModule {}  



  

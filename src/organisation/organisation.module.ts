import { Module } from '@nestjs/common';
import { OrganisationService } from './organisation.service';
import { OrganisationController } from './organisation.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrganisationRepo } from './organisation.repository';

@Module({
  imports: [TypeOrmModule.forFeature([OrganisationRepo])],
  controllers: [OrganisationController],
  providers: [OrganisationService],
})
export class OrganisationModule {}

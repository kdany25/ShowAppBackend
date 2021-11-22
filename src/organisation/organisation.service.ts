import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { CreateOrganisationDto } from './dto/create-organisation.dto';
import { UpdateOrganisationDto } from './dto/update-organisation.dto';
import { Organisation } from './entities/organisation.entity';
import { OrganisationRepo } from './organisation.repository';

@Injectable()
export class OrganisationService {

  constructor(
    @InjectRepository(OrganisationRepo)
    private organisationRepo:OrganisationRepo,
  ){}

  async create(createOrganisationDto: CreateOrganisationDto):Promise<Organisation>  {
   try{
    const organization = await this.organisationRepo.save(createOrganisationDto);
    return organization;
   } catch(error){
     if (error.code = 23505) {
      throw new ConflictException("user already exist");
     }else{
       throw error;
     }
     
   }
  }

  findAll(): Promise<Organisation[]> {
    return this.organisationRepo.find();
  }

 findById(organisationId: string):Promise<Organisation> {
    return this.organisationRepo.findOne({organisationId});
  }

  findByName(name:string):Promise<Organisation[]> {
    
    return this.organisationRepo.find(
      {where:
        [
          {name:ILike(`%${name}%`)}
        ]
    }
      );
  }

  update(organisationId: string, updateOrganisationDto: UpdateOrganisationDto) {
     
    return this.organisationRepo.update(organisationId,updateOrganisationDto)

  }

  remove(organisationId: string) {
    return this.organisationRepo.delete(organisationId);
  }

  getOrganisationsByUserId(userId:string){
    return this.organisationRepo.find({where:{user:userId}})
  }

}

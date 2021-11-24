import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtPayload } from 'src/shared/interfaces';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { ILike, Repository } from 'typeorm';
import { CreateOrganisationDto } from './dto/create-organisation.dto';
import { UpdateOrganisationDto } from './dto/update-organisation.dto';
import { Organisation } from './entities/organisation.entity';

@Injectable()
export class OrganisationService {

  constructor(
    @InjectRepository(Organisation)
    private readonly organisationRepo:Repository<Organisation>,
    private userServices:UserService
  ){}

  async create(createOrganisationDto: CreateOrganisationDto, organizerId:string):Promise<Organisation>  {
   try{
     
    const organization = await this.organisationRepo.save({...createOrganisationDto,userId:organizerId});
    return organization;
   } catch(error){
     if (error.code = 23505) {
      throw new ConflictException("Organisation already exists");
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

 async update(organisationId: string, {name,email,avatar,description,address}: UpdateOrganisationDto, token:string) {
  

    const org= await this.findById(organisationId)
     
    if(name) org.name=name;
    if(email) org.email=email;
    if(avatar) org.avatar=avatar;
    if(description) org.description=description;
    if(address) org.address=address;

    await this.organisationRepo.save(org);
    return{data:org}

  }

  remove(organisationId: string) {
    return this.organisationRepo.delete(organisationId);
  }

  getOrganisationsByUserId(userId:string){
    return this.organisationRepo.find({where:{user:userId}})
  }

  async validateUser(payload: JwtPayload): Promise<User> {
    const user = await this.userServices.findOne(payload.userId);
    if (!user) throw new UnauthorizedException('Invalid token');
    return user;
  }

}

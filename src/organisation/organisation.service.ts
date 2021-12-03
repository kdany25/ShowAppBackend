import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtPayload, Status } from 'src/shared/interfaces';
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
    private readonly organisationRepo: Repository<Organisation>,
    private userServices: UserService,
  ) {}

  // create organization:

  async create(
    createOrganisationDto: CreateOrganisationDto,
    user: User,
  ): Promise<Organisation> {
    try {
      const organization = await this.organisationRepo.save({
        ...createOrganisationDto,
        user,
      });

      return organization;
    } catch (error) {
      if (error.code == 23505) {
        throw new ConflictException('Organisation already exists');
      } else {
        throw error;
      }
    }
  }

  // find all organizations:

  async findAll(status: Status): Promise<Organisation[]> {
    if (status) {
      if (!Object.values(Status).includes(status))
        throw new BadRequestException('UNKNWON STATUS');
      let organizations = await this.organisationRepo.find({
        where: {
          status,
        },
      });
      if (!organizations) throw new NotFoundException('no organisations found')
      return organizations;
    }
    let organisations = await this.organisationRepo.find();
    if (!organisations) throw new NotFoundException('no organisations found')
    return organisations;
  }

  // Find one organization by Id:

  async findById(organisationId: string): Promise<Organisation> {
    let org = await this.organisationRepo.findOne({ organisationId });
    if (!org || org.status == Status.DELETED) throw new NotFoundException(' no organization found');
    return org;
  }

  // Search organization by name:

  async findByName(name: string): Promise<Organisation[]> {
    try{
    let organisations = await this.organisationRepo.find({
      where: [{ name: ILike(`%${name}%`) }],
    });
    if (organisations.length<1) throw new NotFoundException('0 results');
    return organisations.filter(item=>item.status==Status.ACTIVE)
  }catch (error){
throw new Error (error.message)
  }
  }

  // Update Organization:

  async update(
    organisationId: string,
    updateOrganisationDto: UpdateOrganisationDto,
    user: any,
  ) {
    try {
      const org = await await this.findById(organisationId);
      if (!org || org.status == Status.DELETED) throw new NotFoundException('Organization not found');
    
        if (org.user.userId != user.userId && user.role == "ORGANISER")
        throw new ForbiddenException(
          'Access denied, You can only update your organization',
        );
      

      return await this.organisationRepo.save({
        ...org,
        ...updateOrganisationDto,
      });
    } catch (error) {
      if (error.code == 23505) {
        throw new ConflictException('Organisation already exists');
      } else {
        throw error;
      }
    }
  }

  // Delete organization:

  async remove(organisationId: string, user: any) {
    const org = await await this.findById(organisationId);
    if (!org || org.status == Status.DELETED) throw new NotFoundException('Organization not found');

    
    if (org.user.userId != user.userId && user.role == "ORGANISER")
      throw new ForbiddenException(
        'Access denied, You can only delete your organization',
      );

    const deleted = { ...org };
    await this.organisationRepo.save({ ...org, status: Status.DELETED });

    return { message: 'organization deleted successfully', data: deleted };
  }

  // Get organizations by user Id:

  async getOrganisationsByUserId(user: any):Promise<Organisation[]> {
    let orgs = await this.organisationRepo.find({user});
    return orgs;

  }

  // Suspend organization:

  async suspendOrganization(id: string): Promise<Organisation> {
    const org = await this.findById(id);
    if (org.status != Status.ACTIVE)
      throw new BadRequestException(
        'Only active organization can be suspended',
      );
    return await this.organisationRepo.save({ ...org, status: Status.SUSPENDED });
  }

  // Reactivate Organizations:

  async reactivateOrganization(id: string): Promise<Organisation> {
    const org = await this.findById(id);
    if (org.status != Status.SUSPENDED)
      throw new BadRequestException('The organization is not suspended');
    return await this.organisationRepo.save({ ...org, status: Status.ACTIVE });
  }

  // VAlidate User:

  async validateUser(payload: JwtPayload): Promise<User> {
    const user = await this.userServices.findOne(payload.userId);
    if (!user) throw new UnauthorizedException('Invalid token');
    if(user.role != 'ORGANISER') throw new ForbiddenException("Access denied, You need to be an organizer!");
    return user;
  }
}

import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateRequestRoleChangeDto } from './dto/create-request-role-change.dto';
import { UpdateRequestRoleChangeDto } from './dto/update-request-role-change.dto';
import { RequestRoleChange } from './entities/request-role-change.entity'
import { InjectRepository } from '@nestjs/typeorm';
import { JwtPayload } from 'src/shared/interfaces';
import { Repository } from 'typeorm';
import { v4 as uuid } from 'uuid';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';


@Injectable()
export class RequestRoleChangeService {
  constructor(
    @InjectRepository(RequestRoleChange)
    private readonly requestRoleChangeRepo: Repository<RequestRoleChange>,
    private userServices: UserService
  ) {}

  // create a new request role change request

  async create(user: any): Promise<any> {
    const newRequest = { requestId: uuid(), user: user };
    await this.requestRoleChangeRepo.save(newRequest);
    return newRequest;
  }

  // validate user request header
  async validateUser(payload: JwtPayload): Promise<User> {
    const user = await this.userServices.findOne(payload.userId);
    if (!user) throw new UnauthorizedException('Invalid token');
    return user;
  }

  //approve role change and user role 
  async updateRequest(id:string): Promise<any> {
    await this.requestRoleChangeRepo.update( id , { isApproved: true })
    const updatedRequest = await this.findOne(id)
    const userToUpdate = updatedRequest.user.userId;
    const nameToUpdate = updatedRequest.user.firstName + ' ' + updatedRequest.user.lastName;
    await this.userServices.findOne(userToUpdate)
    await this.userServices.changeRole(userToUpdate)
    return nameToUpdate;
  }

  findAll() {
    return `This action returns all requestRoleChange`;
  }
  
  // find one role change request
  async findOne(id: string) {
    const singleRequest = await this.requestRoleChangeRepo.findOne({
      where: { requestId: id },
    });
    if (!singleRequest) throw new NotFoundException('No request with that ID found');
    return singleRequest;
  }

  //find user in requests table
  async findOneUser(id: string) {
    const singleUser = await this.requestRoleChangeRepo.findOne({
      where: { id },
    });
    if (singleUser) throw new ConflictException('You have already requested to be an Organizer, please bear with as we process your request');
    return singleUser;
  }

  update(id: number, updateRequestRoleChangeDto: UpdateRequestRoleChangeDto) {
    return `This action updates a #${id} requestRoleChange`;
  }

  remove(id: number) {
    return `This action removes a #${id} requestRoleChange`;
  }
}

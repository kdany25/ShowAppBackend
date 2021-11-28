import { ConflictException, ForbiddenException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { RequestRoleChange } from './entities/request-role-change.entity'
import { InjectRepository } from '@nestjs/typeorm';
import { JwtPayload } from '../shared/interfaces';
import { Repository } from 'typeorm';
import { v4 as uuid } from 'uuid';
import { User } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';


@Injectable()
export class RequestRoleChangeService {
  constructor(
    @InjectRepository(RequestRoleChange)
    private readonly requestRoleChangeRepo: Repository<RequestRoleChange>,
    private userServices: UserService
  ) {}

  // create a new request role change request

  async create(user: any): Promise<any> {
    if (user.role === "ORGANISER") throw new ConflictException({status: 409, message:'you arleady have organiser as role'});
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
  async updateRequest(user:any,id:string): Promise<any> {
    if (user.role !== "ADMIN") throw new ForbiddenException("You are not allowed to complete this action")
    await this.requestRoleChangeRepo.update( id , { isApproved: true })
    const updatedRequest = await this.findOne(user,id);
    const userToUpdate = updatedRequest.user.userId;
    const nameToUpdate = updatedRequest.user.firstName + ' ' + updatedRequest.user.lastName;
    await this.userServices.findOne(userToUpdate)
    await this.userServices.changeRole(userToUpdate)
    return nameToUpdate;
  }

  // Find all requests
  async findAll(user: any) {
    if (user.role !== "ADMIN") throw new ForbiddenException("You are not an admin");
    const requests = await this.requestRoleChangeRepo.find();
    if (requests.length <= 0) throw new NotFoundException("no new requests");
    return requests;
  }
  
  // find one role change request
  async findOne(user:any,id: string) {
    if (user.role !== "ADMIN") throw new ForbiddenException("You are not an admin");
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

}

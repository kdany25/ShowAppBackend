import { ConflictException, Injectable } from '@nestjs/common';
import { CreateUserDto} from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
//import { verifyUserDto } from './dto/verify-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
//import {Observable,from} from 'rxjs';
import {User} from '../user/entities/user.entity'
import { Repository } from 'typeorm';
import {v4 as uuid} from 'uuid';
import * as SendGrid from '@sendgrid/mail';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
@Injectable()
export class UserService {
  constructor (
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private jwtService: JwtService
  ){}

  // create a new user
  async create(createUserDto: CreateUserDto ):Promise<User> {
    const {password,...rest} = createUserDto;
    const hashedPassword = await this.encryptPassword(password)
    const newUser = {userId:uuid(),password:hashedPassword,...rest}
    await this.userRepository.save(newUser);
    delete newUser.password;
    return newUser;
  }

  // finds existing email in the database
  async findUserByEmail(email: string) {
    const userEmail = await this.userRepository.findOne({where:{email:email}})
    if (userEmail) throw new ConflictException({statusCode: 409, message: `User with the same email already exists`});
    }

  // finds existing email in the database
  async findEmail(email: string) {
    const userEmail = await this.userRepository.findOne({ where: { email: email } })
    if (userEmail) return userEmail
  }

  // password encryptor function
  async encryptPassword(password: string) {
    return await bcrypt.hash(password, 10)
  }

  // email sender function
  sendConfirmationEmail(valEmail:string, token:string) {
    const mailContent = {
      to: valEmail,
      subject:'Email verification',
      from:process.env.EMAIL_SENDER,
      html: `Hello from ShowApp, please use this <a href="${process.env.HOST}:3000/user/verify/${token}">link</a> to verify your email`
      
    }

    SendGrid.setApiKey(process.env.SENDGRID_API_KEY)
    const transport  = SendGrid.send(mailContent)
    return transport
    
    
  }

  //token generator
  async genareteToken(email:string) {
  return await this.jwtService.signAsync(email)
  }

  //verify token 
  async verifyToken(token) {
    return await this.jwtService.verifyAsync(token)
  }

  //verify user function 
  async verifyUser(email: string ) {
    const userExist = await this.findEmail(email)
    //console.log(userExist)
    return await this.userRepository.update({email}, {isVerified: true})
  }




  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}

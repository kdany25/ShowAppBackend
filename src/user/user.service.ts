import { ConflictException, Injectable,Inject, ForbiddenException, NotFoundException, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuid } from 'uuid';
import * as SendGrid from '@sendgrid/mail';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { User } from '../user/entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  // create a new user
  async create(createUserDto: CreateUserDto): Promise<User> {
    const { password, ...rest } = createUserDto;
    const hashedPassword = await this.encryptPassword(password);
    const newUser = { userId: uuid(), password: hashedPassword, ...rest };
    await this.userRepository.save(newUser);
    delete newUser.password;
    return newUser;
  }

  // finds existing email in the database while creating new user
  async findUserByEmail(email: string,password: string) {
    const userEmail = await this.userRepository.findOne({ where: { email: email } })
    if (!userEmail) return 0
    if (userEmail.status === "active") throw new ConflictException({ statusCode: 409, message: `User with the same email already exists` });
    if (userEmail.status === "deleted") return await this.createReturningUser(email, password)
    
  }

  async createReturningUser(email:string,password:string) {
    const hashed = await this.encryptPassword(password);
    await this.userRepository.update({ email }, { status: "active" })
   return await this.userRepository.update({ email }, { password: hashed })
   
  }

  // finds existing email in the database
  async findEmail(email: string) {
    const userEmail = await this.userRepository.findOne({
      where: { email: email },
    });
    if (userEmail) return userEmail;
    throw new NotFoundException({
      statusCode: 404,
      message: `User with email '${email}' does not exist`,
    });
  }

  // password encryptor function
  async encryptPassword(password: string) {
    return await bcrypt.hash(password, 10);
  }

  // email sender function
  sendConfirmationEmail(valEmail: string, token: string) {
    const data = {
      template: 'd-fd14225b63a240bb8cfe14ba21cf4254',
    };

    const mailContent = {
      to: valEmail,
      //subject: 'Email verification',
      from: process.env.EMAIL_SENDER,
      templateId: data.template,

      dynamic_template_data: {
        verify_url: `${process.env.HOST}/user/verify/${token}`,
        header: 'Hello from ShowApp!!',
        body: 'Please verify your email address to get access to thousands of exclusive events',
        button_text: 'Click here to verify',
        subject: 'ShowApp email verification',
        preheader: 'Please verify your email',
      },
    };

    SendGrid.setApiKey(process.env.SENDGRID_API_KEY);
    const transport = SendGrid.send(mailContent);
    return transport;
  }

  //token generator
  async genareteToken(email) {
    return await this.jwtService.signAsync({ ...email });
  }

  //verify token
  async verifyToken(token) {
    const verified = await this.jwtService.verifyAsync(token);
    if (!verified) throw new ForbiddenException({ statusCode: 403, error: 'Invalid token' });
    return verified;
  }

  //verify user function
  async verifyUser(email: string) {
    await this.findEmail(email);
    return await this.userRepository.update({ email }, { isVerified: true });
  }

  // change user role
  async changeRole(id: string) {
    return await this.userRepository.update(id, { role: 'ORGANISER' });
  }

  async findAll(): Promise<User[]> {
    const users = await this.userRepository.find({ relations: ['organisation', 'tickets'] });
    return users.map((user) => {
      delete user.password;
      return user;
    });
  }

  async findOne(id: string): Promise<any> {
    const singleUser = await this.userRepository.findOne({
      where: { userId: id }, relations: ['organisation','tickets']
    });
    if (!singleUser) throw new NotFoundException(`user with this id ${id} not is system!`);
    delete singleUser.password;
    return singleUser;
  }

  // genarete jwt token
  async genareteTokenWithEmail({ ...payload }) {
    return await this.jwtService.signAsync({ ...payload });
  }

  // verify token
  async verfyToken(token) {
    return await this.jwtService.verifyAsync(token);
  }

  // bcrypting passsword
  bcryptPassword(password) {
    return bcrypt.hash(password, 10);
  }

  // comparing password from client side with password saved in database
  async comparePassword(userPassword: string, savedPassword: string) {
    const compared = await bcrypt.compare(userPassword, savedPassword);
    // check saved user password with entered password by user
    if (!compared) throw new UnauthorizedException({ status: 401, error: 'password incorrect!' });
    return compared;
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { email: email } });
    if (!user) throw new UnauthorizedException({
        status: 401,
        error: `You don't have account with this email: ${email}!`,
      });
    if (user.status !== 'active') throw new UnauthorizedException({ status: 401, error: `You don't have account with this email: ${email}!`,});
    if (!user.isVerified) throw new UnauthorizedException({ status: 401, error: `Please verify your account first!` });

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    await this.findOne(id);
    return await this.userRepository.update(id, updateUserDto);
  }

  async remove(id: string) {
    const userExist = await this.findOne(id);
    if(userExist.status === 'deleted') throw new ForbiddenException('user already deleted');
    return await this.userRepository.update(id, { status: 'deleted' });
  }

  async saveResetPassToken(email: string, token: string) {
    const user = await this.findByEmail(email);
    return await this.userRepository.update({ email: user.email }, { resetPasswordToken: token });
  }

  sendEmail(userEmail: string, token: string) {
    const data = {
      template: 'd-fd14225b63a240bb8cfe14ba21cf4254',
    };

    const mail = {
      to: userEmail,
      subject: 'Reset password',
      from: process.env.EMAIL_SENDER,
      html: `Click here to reset your password <a href= "${process.env.HOST}/user/${token}">click here</a>`,
      templateId: data.template,

      dynamic_template_data: {
        verify_url: `${process.env.HOST}/user/reset/${token}`,
        header: 'Hello from ShowApp!!',
        body: 'Have you requested to reset your password?use the link below, if it was not you ignore this email',
        button_text: 'Reset your password',
        subject: 'ShowApp reset password',
        preheader: 'Reset your password',
      },
    };

    SendGrid.setApiKey(process.env.SENDGRID_API_KEY);
    const transport = SendGrid.send(mail);
    return transport;
  }

  // reset password
  async resetPassword(newPasswrod: string, confirmPassword: string, token: string) {
    const userEmail = await this.verfyToken(token);
    const userToRestPassword = await this.findByEmail(userEmail.email);
    if (token !== userToRestPassword.resetPasswordToken)
      throw new ForbiddenException('reset password link was already used! please request a link to reset password' );

    //check if password are munching
    if (newPasswrod !== confirmPassword) throw new ForbiddenException('Password does not munch');

    const bcryptedPassword = await this.bcryptPassword(newPasswrod);
    await this.userRepository.update({ userId: userToRestPassword.userId }, { password: bcryptedPassword });
    await this.userRepository.update({ userId: userToRestPassword.userId }, { resetPasswordToken: null });
    return userEmail;
  }

  // change password
  async changepassword(currentPassword, newPassword, confirmPassword, token, res) {
    const verifyToken = await this.verfyToken(token);
    const user = await this.userRepository.findOne(verifyToken.userId);

    await this.comparePassword(currentPassword, user.password);

    if (newPassword !== confirmPassword) return res.status(409).json({ error: 'new password and confirm password does not munch!' });
    const passwordTosave = await this.bcryptPassword(newPassword);

    return await this.userRepository.update(user.userId, { password: passwordTosave });
  }

  // date of birth validator
  
  async validateDate(dOb:Date) {
    const dateof = new Date(dOb)
    const currentDate = new Date(Date.now())
    const dobYear = dateof.getFullYear()
    const currentYear = currentDate.getFullYear()    
    if (dobYear > currentYear) return false
    else return true
  }
}

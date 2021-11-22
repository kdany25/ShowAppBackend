import { Controller, Get, Post, Body, Patch, Param, Delete, Res, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Response } from 'express';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Post()
  async create(@Body() createUserDto: CreateUserDto, @Res() res: Response): Promise<any> {
    await this.userService.findUserByEmail(createUserDto.email)
    try {
      const token = await this.userService.genareteToken(createUserDto.email)
      const data = await this.userService.create(createUserDto)
      this.userService.sendConfirmationEmail(createUserDto.email,token);
      return res.status(201).json({ message: "User successfully created", data: data });
    } catch (error) {
      return res.status(500).json({ statusCode: 500, error: error.message })
    }
  }

  @Patch('verify/:token')
  async verifyUser(@Param('token') token: string, @Res() res:Response) {
    const decodedToken = await this.userService.verifyToken(token)
    console.log(decodedToken)
  //  const email = await this.userService.findUserByEmail(decodedToken)
    await this.userService.verifyUser(decodedToken)
    return  res.status(202).json({message:"User succesfully verified"})
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}

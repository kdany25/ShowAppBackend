import { Controller, Get, Post, Body, Patch, Param, Headers, Delete, Res, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { userLoginDto } from './dto/login.dto';
import { Response, Request } from 'express';
import { requestResetDto } from './dto/requestReset.dto';
import { resetPasswordDto } from './dto/resetPassword.dto';
import { changePasswordDto } from './dto/changePassword.dto';
import { ApiAcceptedResponse, ApiResponse, ApiBody, ApiCreatedResponse, ApiForbiddenResponse, ApiNotFoundResponse, ApiOkResponse, ApiResponseProperty, ApiTags, ApiUnauthorizedResponse, } from '@nestjs/swagger';

@ApiTags('User CRUD')
@Controller('/user')
export class UserController {
  constructor( private readonly userService: UserService) { }

  @ApiCreatedResponse({ status: 201, description:'User succesfully created'})
  @ApiBody({type:CreateUserDto})
  @Post()
  async create(@Body() createUserDto: CreateUserDto, @Res() res: Response): Promise<any> {
    await this.userService.findUserByEmail(createUserDto.email)
    try {
      const payload = {
        email: createUserDto.email
      }
      const token = await this.userService.genareteToken({...payload})
      const data = await this.userService.create(createUserDto)
      this.userService.sendConfirmationEmail(createUserDto.email,token);
      return res.status(201).json({ message: "User successfully created", data: data });
    } catch (error) {
      return res.status(500).json({ statusCode: 500, error: error.message })
    }
  }

  @ApiAcceptedResponse({ status:202,description:"User successfully verified"})
  @ApiForbiddenResponse({ status: 403, description: "Invalid or invalid token" })
  @ApiNotFoundResponse({ status:404, description: "User not found" })
  @Patch('verify/:token')
  async verifyUser(@Param('token') token: string, @Res() res:Response) {
    try {
      const decodedToken = await this.userService.verifyToken(token)
      await this.userService.verifyUser(decodedToken.email)
      return  res.status(202).json({message:"User succesfully verified"})  
    } catch (error) {
      return res.status(500).json({ statusCode: 500, error: error.message })
    }
  }

  @Get('/all')
  @ApiResponse({status:200, description:'all users retrieved'})
  findAll() {
    return this.userService.findAll();
  }

  @Get('/all/:id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Patch('/all/:id')
 async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto, @Res() res: Response) {
    await this.userService.update(id, updateUserDto);
    return res.status(200).json({statusCode:200, message:"user updated successful"})
  }

  @Delete('/all/:id')
  async remove(@Param('id') id: string, @Res() res: Response) {
    await this.userService.remove(id);
    return res.status(200).json({statusCode:200, message:"user deleted successful"})
  }

  // user login
  @Post('/login')
  async userLogin(@Body() login: userLoginDto, @Res() res: Response,): Promise<any> {
    // find user exist
    const userExist = await this.userService.findByEmail(login.email);
    await this.userService.comparePassword(login.password, userExist.password)

    try {
      // generate token from service
      const payload = {
        userId: userExist.userId,
        role: userExist.role
      }
      const token = await this.userService.genareteTokenWithEmail({...payload })
      res.cookie('accessToken', token)
      return res.status(200).json({message:'log in successful', token});
      
    } catch (error) {
      return res.status(500).json({ error: error.message})
    }
  }

  // send email to request reset password
  @Post('/requestpasswordreset')
 async requestPasswordReset(@Body() resetpassword: requestResetDto, @Res() res: Response): Promise<any> {

     const userExist = await this.userService.findByEmail(resetpassword.email);
     const payload = {
      userId: userExist.userId,
      email: userExist.email
    }
     const token = await this.userService.genareteTokenWithEmail({...payload});
     
     this.userService.sendEmail(userExist.email, token);
     return res.status(200).json({message:'We sent link to reset password to your email!'});

  }

  // reset password
  @Patch('/:token')
  async resetPassword(@Body() resetDto: resetPasswordDto, @Param('token') token, @Res() res: Response) {
    try {
     await this.userService.resetPassword(resetDto.newPassword, resetDto.confirmPassword, token)
     return res.status(200).json({message: 'password reseted successful! login with new password'}) 
    } catch (error) {
      return res.status(500).json({error: error.message})
    }
  }

  
  // user log out
  @Post('/logout')
  userLogout( @Res() res: Response, @Req() req: Request){
    // check if user already log out 
    if(!req.cookies.accessToken) return res.status(400).json({statusCode:400, error:' you already loged out'})
    res.clearCookie('accessToken','/')
    return res.status(200).json({statusCode:200, message:'Log out successful!'})
  }

  // change password
  @Patch('/account/me')
  async changePassword(@Body() resetDto: changePasswordDto, @Res() res: Response, @Req() req: Request, @Headers('authorization') headers: string ) {
  
    if(!headers) return res.status(401).json({error: 'unauthorized!, please Login'})
    const token = headers.split(' ')[1]

     await this.userService.changepassword(resetDto.currentPassword, resetDto.newPassword, resetDto.confirmPassword, token, res)
     return res.status(200).json({message: 'password changed successful! login with new password!'}) 
    
  }
}


import { Controller, Get, Post, Patch, Param, Res, UseGuards } from '@nestjs/common';
import { RequestRoleChangeService } from './request-role-change.service';
import { Response } from 'express';
import { ApiBearerAuth, ApiConflictResponse, ApiCreatedResponse, ApiForbiddenResponse, ApiNotFoundResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { GetUserFromRequest } from '../shared/decorators/user.decorator';
import { AuthGuard } from '@nestjs/passport';


@ApiTags("Request Role change CRUD operations ")
@Controller('request-role-change')
export class RequestRoleChangeController {
  constructor(private readonly requestRoleChangeService: RequestRoleChangeService) {}
  @ApiTags('x-user-journey')
  @ApiCreatedResponse({ status: 201, description: 'Request succesfully sent' })
  @ApiConflictResponse({status:409, description: 'You are already an organizer'})
  @ApiBearerAuth('access-token')
  @Post()
  @UseGuards(AuthGuard())
  async create( @Res() res:Response,@GetUserFromRequest() user:any): Promise<any> {
    try {
      const request = await this.requestRoleChangeService.create(user);
      return res.status(201).json({ message: "Role request created successfully", data: { request } });
    } catch (error) {
      return res.status(500).json({ status: 500, error: error.message })
    }
  }

  @ApiOkResponse({ status: 200, description: 'Request(s) found' })
  @ApiForbiddenResponse({ status: 403, description: 'You are not an admin' })
  @ApiNotFoundResponse({ status: 404, description: 'No new requests'})
  @ApiBearerAuth('access-token')
  @Get("all")
  @UseGuards(AuthGuard())
  async findAll(@Res() res:Response, @GetUserFromRequest() user:any): Promise<any>{
    const requests = await this.requestRoleChangeService.findAll(user);
    res.json({requests: requests});
  }

  @ApiOkResponse({ status: 200, description: 'Request found' })
  @ApiForbiddenResponse({ status: 403, description: 'You are not an admin' })
  @ApiBearerAuth('access-token')
  @Get(':id')
  @UseGuards(AuthGuard())
  async findOneRequest(@Param('id') id: string, @Res() res: Response, @GetUserFromRequest() user:any ):Promise<any> {
    try {
     const requestt = await this.requestRoleChangeService.findOne(user,id)  
      return res.status(200).json({ message: "Request found", data: { requestt } });
    } catch (error) {
      return res.status(500).json({ status: 500, error: error.message });
    }
  }

  @ApiTags('x-user-journey')
  @ApiOkResponse({ status: 202, description: 'Request succesfully approved' })
  @ApiForbiddenResponse({ status: 403, description: 'You are allowed to perform this action' })
  @ApiBearerAuth('access-token')
  @Patch('approve/:id')
  @UseGuards(AuthGuard())
  async aproveRoleChange(@Param('id') id: string, @Res() res: Response,@GetUserFromRequest() user:any) {    
    try {
      await this.requestRoleChangeService.findOne(user,id)
      const resp = await this.requestRoleChangeService.updateRequest(user,id)
      return res.status(202).json({ message: `user ${resp} is now an Organizer` })
    } catch (error) {
      return res.status(500).json({ status: 500, error: error.message })
    }
  }

}

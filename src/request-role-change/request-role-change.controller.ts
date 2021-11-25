import { Controller, Get, Post, Body, Patch, Param, Delete, Res, UseGuards, ForbiddenException, ConflictException } from '@nestjs/common';
import { RequestRoleChangeService } from './request-role-change.service';
import { CreateRequestRoleChangeDto } from './dto/create-request-role-change.dto';
import { UpdateRequestRoleChangeDto } from './dto/update-request-role-change.dto';
import { Response, Request } from 'express';
import { RequestRoleChange } from './entities/request-role-change.entity'
import { ApiBearerAuth, ApiConflictResponse, ApiCreatedResponse, ApiForbiddenResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { GetUserFromRequest } from 'src/shared/decorators/user.decorator';
import { AuthGuard } from '@nestjs/passport';


@ApiTags(" Request Role change CRUD operations ")
@Controller('request-role-change')
export class RequestRoleChangeController {
  constructor(private readonly requestRoleChangeService: RequestRoleChangeService) {}

  @ApiCreatedResponse({ status: 201, description: 'Request succesfully sent' })
  @ApiConflictResponse({status:409, description: 'You are already an organizer'})
  @ApiBearerAuth('access-token')
  @Post()
  @UseGuards(AuthGuard())
  async create( @Res() res:Response,@GetUserFromRequest() user:any): Promise<any> {
    try {
      if (user.role === "ORGANISER") return res.status(409).json({error: "You are already an organizer"})
      const request = await this.requestRoleChangeService.create(user);
      return res.status(201).json({ message: "Role request created successfully", data: { request } });
    } catch (error) {
      return res.status(500).json({ status: 500, error: error.message })
    }
  }

  @Get()
  findAll() {
    return this.requestRoleChangeService.findAll();
  }

  @Get(':id')
  @UseGuards(AuthGuard())
  async findOneRequest(@Param('id') id: string, @Res() res: Response):Promise<any> {
    
    
    try {
     const requestt = await this.requestRoleChangeService.findOne(id)  
      return res.status(200).json({ message: "Request found", data: { requestt } });
    } catch (error) {
      return res.status(500).json({ status: 500, error: error.message });
    }
  }
  @ApiOkResponse({ status: 202, description: 'Request succesfully approved' })
  @ApiForbiddenResponse({ status: 403, description: 'You are allowed to perform this action' })
  @ApiBearerAuth('access-token')
  @Patch(':id')
  @UseGuards(AuthGuard())
  async aproveRoleChange(@Param('id') id: string, @Res() res: Response,@GetUserFromRequest() user:any) {    
    if (user.role !== "ADMIN") throw new ForbiddenException("You are not allowed to complete this action")
    try {
      await this.requestRoleChangeService.findOne(id)
      const resp = await this.requestRoleChangeService.updateRequest(id)
      return res.status(202).json({ message: `Role change approved and user ${resp} is now an Organizer` })
    } catch (error) {
      return res.status(500).json({ status: 500, error: error.message })
    }
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRequestRoleChangeDto: UpdateRequestRoleChangeDto) {
    return this.requestRoleChangeService.update(+id, updateRequestRoleChangeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.requestRoleChangeService.remove(+id);
  }
}

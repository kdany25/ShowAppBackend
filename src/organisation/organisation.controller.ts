import { Controller, Get, Post, Body, Patch, Param,Headers, Delete, ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { OrganisationService } from './organisation.service';
import { CreateOrganisationDto } from './dto/create-organisation.dto';
import { UpdateOrganisationDto } from './dto/update-organisation.dto';
import { ApiBearerAuth, ApiConflictResponse, ApiCreatedResponse, ApiResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { GetUserFromRequest } from 'src/shared/decorators/user.decorator';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Organisation')
@Controller('organisation')
export class OrganisationController {
  
  constructor(private readonly organisationService: OrganisationService) {}

  @Post('/create')
  @UseGuards(AuthGuard())
  @ApiBearerAuth()
  @ApiCreatedResponse({status:201,description:'Organisation created successfully'})
  @ApiUnauthorizedResponse({ status: 401, description: 'Unauthorized' })
  @ApiConflictResponse({ status: 409, description: 'Organization already exists' })
  createOrganisation(@Body() createOrganisationDto: CreateOrganisationDto, @GetUserFromRequest('userId') organizer:string) {
    return this.organisationService.create(createOrganisationDto,organizer);
  }


  @ApiResponse({ status: 200, description: 'Organisations fetched successfully' })
  @ApiResponse({ status: 404, description: 'N0t found' })
  @Get()
  findAll() {
    return this.organisationService.findAll();
  }


  @ApiResponse({ status: 200, description: 'Organisation fetched' })
  @ApiResponse({ status: 404, description: 'N0t found' })
  @Get(':organisationId')
  findOne(@Param('organisationId',ParseUUIDPipe) organisationId: string) {
    return this.organisationService.findById(organisationId);
  }


  @ApiResponse({ status: 200, description: 'Organisation fetched' })
  @ApiResponse({ status: 404, description: 'N0t found' })
  @Get('search/:name')
  getOrganisationByName(@Param('name') name:string){
    return this.organisationService.findByName(name);
  }


  @ApiResponse({ status: 201, description: 'Organisation updated successfully!' })
  @ApiResponse({ status: 404, description: 'Not found' })
  @Patch(':organisationId')
  update(@Param('organisationId',ParseUUIDPipe)organisationId: string, @Body() updateOrganisationDto: UpdateOrganisationDto, @Headers('authorization') headers:string) {
    const token = headers.split(' ')[1];
    return this.organisationService.update(organisationId, updateOrganisationDto, token);
  }


  @ApiResponse({ status: 201, description: 'Organisations fetched successfully!' })
  @ApiResponse({ status: 404, description: 'Not found' })
  @Get('user/:userId')
  getOrganisationByUserId(@Param('userId') userId:string){
    return this.organisationService.getOrganisationsByUserId(userId);
  }


  @ApiResponse({ status: 200, description: 'Organisation deleted successfully!' })
  @ApiResponse({ status: 404, description: 'Not found' })
  @Delete(':organisationId')
  remove(@Param('organisationId') organisationId: string) {
    return this.organisationService.remove(organisationId);
  }

  
}

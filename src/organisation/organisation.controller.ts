import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe } from '@nestjs/common';
import { OrganisationService } from './organisation.service';
import { CreateOrganisationDto } from './dto/create-organisation.dto';
import { UpdateOrganisationDto } from './dto/update-organisation.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Organisation')
@Controller('organisation')
export class OrganisationController {
  
  constructor(private readonly organisationService: OrganisationService) {}

  @ApiResponse({status:201,description:'Organisation created successfully'})
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Post('/create')
  createOrganisation(@Body() createOrganisationDto: CreateOrganisationDto) {
    return this.organisationService.create(createOrganisationDto);
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
  update(@Param('organisationId',ParseUUIDPipe)organisationId: string, @Body() updateOrganisationDto: UpdateOrganisationDto) {
    return this.organisationService.update(organisationId, updateOrganisationDto);
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

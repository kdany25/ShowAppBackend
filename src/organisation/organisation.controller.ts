import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  UseGuards,
  Query,
} from '@nestjs/common';
import { OrganisationService } from './organisation.service';
import { CreateOrganisationDto } from './dto/create-organisation.dto';
import { UpdateOrganisationDto } from './dto/update-organisation.dto';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiQuery,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { GetUserFromRequest } from '../shared/decorators/user.decorator';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/user/entities/user.entity';
import { IsUserAdminOrOrganizerGuard } from 'src/shared/guards/organizerAndAdmin';
import { IsUserAdminGuard } from 'src/shared/guards/isUserAdmin';
import { Status } from 'src/shared/interfaces';

@ApiTags('Organisation')
@Controller('organisation')
export class OrganisationController {
  constructor(private readonly organisationService: OrganisationService) {}

  // Create Organization

  @ApiTags('x-user-journey')
  @Post('/create')
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard(), IsUserAdminOrOrganizerGuard)
  @ApiCreatedResponse({
    status: 201,
    description: 'Organisation created successfully',
  })
  @ApiUnauthorizedResponse({ status: 401, description: 'Unauthorized' })
  @ApiForbiddenResponse({ status: 403, description: 'Access denied, You need to be an organizer' })
  @ApiConflictResponse({
    status: 409,
    description: 'Organization already exists',
  })
  createOrganisation(
    @Body() createOrganisationDto: CreateOrganisationDto,
    @GetUserFromRequest() organizer: User,
  ) {
    return this.organisationService.create(createOrganisationDto, organizer);
  }

  // Get all Organizations

  @Get()
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard(),IsUserAdminGuard)
  @ApiOkResponse({
    status: 200,
    description: 'Organisations fetched successfully',
  })
  @ApiNotFoundResponse({description: 'Organizations not found' })
  @ApiQuery({ name: 'status', required: false })
  findAll(@Query('status') status?: Status) {
    return this.organisationService.findAll(status);
  }

  // Find one organization by Id

  @ApiOkResponse({ status: 200, description: 'Organisation fetched' })
  @ApiNotFoundResponse({description: 'Organization not found' })
  @Get(':organisationId')
  findOne(@Param('organisationId', ParseUUIDPipe) organisationId: string) {
    return this.organisationService.findById(organisationId);
  }

  // search organization by name

  @ApiResponse({ status: 200, description: 'Organisations fetched' })
  @ApiNotFoundResponse({description: '0 results found' })
  @Get('search/:name')
  getOrganisationByName(@Param('name') name: string) {
    return this.organisationService.findByName(name);
  }

  // Update organization by providing organizationId

  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard())
  @ApiResponse({
    status: 201,
    description: 'Organisation updated successfully!',
  })
  @ApiUnauthorizedResponse({ status: 401, description: 'Unauthorized' })
  @ApiNotFoundResponse({description: 'organization Not found' })
  @ApiForbiddenResponse({status:403, description: "Access denied, You can only update your own organization"})
  @ApiConflictResponse({status:409,description : "conflicts, organizition already exists"})
  @UseGuards(AuthGuard(),IsUserAdminOrOrganizerGuard)
  @Patch('update/:organisationId')
  async update(
    @Param('organisationId', ParseUUIDPipe) organisationId: string,
    @Body() updateOrganisationDto: UpdateOrganisationDto,
    @GetUserFromRequest() user:any,
  ) {
  
    return this.organisationService.update(
      organisationId,
      updateOrganisationDto,
      user,
    );
  }

  // Get all organizations of a particular User

  @ApiOkResponse({
    description: 'Organisations fetched successfully!',
  })
  @ApiNotFoundResponse({description: 'Not found' })
  @UseGuards(AuthGuard(),IsUserAdminOrOrganizerGuard)
  @Get('user/:userId')
  getOrganisationByUserId(@Param('userId') userId) {
    return this.organisationService.getOrganisationsByUserId(userId);
  }

  // Delete an organization by Id

  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard(),IsUserAdminOrOrganizerGuard)
  @ApiOkResponse({
    description: 'Organisation deleted successfully!',
  })
  @ApiNotFoundResponse({ status: 404, description: 'organization Not found' })
  @ApiForbiddenResponse({status:403, description: "Access denied, You can only delete your own organization"})
  @UseGuards(AuthGuard(),IsUserAdminOrOrganizerGuard)
  @Delete(':organisationId')
  remove(@Param('organisationId') organisationId: string,@GetUserFromRequest() user:any,) {
    return this.organisationService.remove(organisationId,user);
  }


  // Suspend Organisation

  @ApiBearerAuth('access-token')
  @ApiOkResponse({ description: 'Organization suspended' })
  @ApiBadRequestResponse({
    description: 'Only an active organization can be suspended',
  })
  @ApiNotFoundResponse({ description: 'Organization not found' })
  @UseGuards(AuthGuard(), IsUserAdminGuard)
  @Patch('suspend/:id')
  async suspendOrganization(
    @Param('id') id: string,
  ) {
    return {
      message: 'Organization suspended.',
      data: await this.organisationService.suspendOrganization(id),
    };
  }


// Activate organisation

@ApiBearerAuth('access-token')
  @ApiOkResponse({ description: 'Organization activated successfully!' })
  @ApiBadRequestResponse({ description: 'The organization is not suspended' })
  @ApiNotFoundResponse({ description: 'Organization not found' })
  @UseGuards(AuthGuard(), IsUserAdminGuard)
  @Patch('reactivate/:id')
  async reactivateOrganization(
    @Param('id') id: string,
  ) {
    return {
      message: 'Organization activated successfully',
      data: await this.organisationService.reactivateOrganization(id),
    };
  }


}

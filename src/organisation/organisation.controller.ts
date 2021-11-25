import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Headers,
  Delete,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import { OrganisationService } from './organisation.service';
import { CreateOrganisationDto } from './dto/create-organisation.dto';
import { UpdateOrganisationDto } from './dto/update-organisation.dto';
import {
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { GetUserFromRequest } from 'src/shared/decorators/user.decorator';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/user/entities/user.entity';

@ApiTags('Organisation')
@Controller('organisation')
export class OrganisationController {
  constructor(private readonly organisationService: OrganisationService) {}

  // Create Organization

  @Post('/create')
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard())
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
  @ApiResponse({
    status: 200,
    description: 'Organisations fetched successfully',
  })
  @ApiResponse({ status: 404, description: 'N0t found' })
  findAll() {
    return this.organisationService.findAll();
  }

  // Find one organization by Id

  @ApiResponse({ status: 200, description: 'Organisation fetched' })
  @ApiResponse({ status: 404, description: 'N0t found' })
  @Get(':organisationId')
  findOne(@Param('organisationId', ParseUUIDPipe) organisationId: string) {
    return this.organisationService.findById(organisationId);
  }

  // search organization by name

  @ApiResponse({ status: 200, description: 'Organisations fetched' })
  @ApiResponse({ status: 404, description: '0 results found' })
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
  @ApiNotFoundResponse({ status: 404, description: 'organization Not found' })
  @ApiForbiddenResponse({status:403, description: "Access denied, You can only update your own organization"})
  @ApiConflictResponse({status:409,description : "conflicts, organizition already exists"})
  @Patch(':organisationId')
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

  @ApiResponse({
    status: 201,
    description: 'Organisations fetched successfully!',
  })
  @ApiNotFoundResponse({ status: 404, description: 'Not found' })
  @Get('user/:userId')
  getOrganisationByUserId(@Param('userId') userId) {
    return this.organisationService.getOrganisationsByUserId(userId);
  }

  // Delete an organization by Id

  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard())
  @ApiResponse({
    status: 200,
    description: 'Organisation deleted successfully!',
  })
  @ApiNotFoundResponse({ status: 404, description: 'organization Not found' })
  @ApiForbiddenResponse({status:403, description: "Access denied, You can only delete your own organization"})
  @Delete(':organisationId')
  remove(@Param('organisationId') organisationId: string,@GetUserFromRequest() user:any,) {
    return this.organisationService.remove(organisationId,user);
  }
}

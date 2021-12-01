import { Controller, Get, Post, Body, Patch, Param, Delete, NotFoundException, Res, UseGuards, Logger, HttpCode, HttpStatus } from '@nestjs/common';
import { EventService } from './event.service';
import { CancelEventDto, CreateEventDto} from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { ApiAcceptedResponse, ApiBearerAuth, ApiBody, ApiConflictResponse, ApiCreatedResponse, ApiForbiddenResponse, ApiNotFoundResponse, ApiOkResponse, ApiResponseProperty, ApiTags, ApiUnauthorizedResponse,  } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { GetUserFromRequest } from '../shared/decorators/user.decorator';
@Controller('event')
@ApiTags('Event')
export class EventController {
  private logger=new Logger('EventController');

  constructor( private eventService: EventService) {}

  /**
   * @Controller create a new event
   * @param createEventDto event details in body
   * @param organisationId current organisation
   * @param userRequest from jwt
   * @returns new event entity object
   * @throws unauthorized error
   */

  @Post(':organisationId')
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard())
  @ApiCreatedResponse({description:'the event has been created'})
  @ApiConflictResponse({description:'event already'})
  @ApiBody({type:CreateEventDto})
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createEventDto: CreateEventDto,@Param('organisationId') organisationId:string,
    @GetUserFromRequest('userId') userRequest:string ) {
    this.logger.log(`Organisation ${organisationId}  creates Event: ${JSON.stringify(createEventDto)} `);
    return await this.eventService.create(createEventDto,organisationId,userRequest);
    
  }

   /**
   * @Controller get all  events
   * 
   * @returns new array of event entity 
   */

  @Get()
  @ApiOkResponse({description:'the event list has been successfully returned '})
  @ApiForbiddenResponse({description:'Forbidden '})
  @HttpCode(HttpStatus.OK)
  findAll() {
    this.logger.verbose(`get All events triggered`);
    return this.eventService.findAll();
  }

  /**
   * @Controller search an event by title
   * @param title event title
   * @returns array of events entity object
   */
  @Get('search/:title')
  @ApiOkResponse({description:'Get  event By title has been successfully returned '})
  @ApiForbiddenResponse({description:'Forbidden '})
  @HttpCode(HttpStatus.OK)
  async findByTitle(@Param('title') title:string ){
    this.logger.verbose(`Search ${title} `);
    return this.eventService.getByTitle(title);

  }

  /**
   * @Controller cancel an event
   * @param id event id 
   * @param organisationId current organisation
   * @returns new event entity object
   * @throws notfound exception
   */
  @Patch('cancel/:id')
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard())
  @ApiAcceptedResponse({description:'Event has been updated successfully'})
  @ApiBody({type:CancelEventDto})
  @ApiUnauthorizedResponse({description:'invalid credentials'})
  @HttpCode(HttpStatus.OK)
  cancelEvent(@Param('id')id:string,@Body() cancelEventDto: CancelEventDto){
    this.logger.log(`cancel event by ${id}`);
    return this.eventService.cancelEvent(id,cancelEventDto);

  }


  /**
   * @Controller cancel an event
   * @param id event id 
   * @param organisationId current organisation
   * @returns new event entity object
   * @throws notfound exception
   */
  @Get('org/:id')
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard())
  @ApiOkResponse({description:'get events by organisation '})
  @HttpCode(HttpStatus.OK)
  getEventByOrganisation(@Param('id') id:string){
    this.logger.log(`get event by organisation ${id}`);
    return this.eventService.getEventByOrganisationId(id);
  }

  /**
   * @Controller find an event
   * @param id event id 
   * @returns new event entity object
   * @throws notfound exception
   */
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard())
  @ApiNotFoundResponse({description:'the event no found'})
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id') id: string) {
    this.logger.log(`retrieve a single event by: ${id}`);
    return this.eventService.findOne(id);
  }

  /**
   * @Controller update an event
   * @param id event id 
   * @param updateEventDto current organisation
   * @returns new event entity object
   * @throws notfound exception
   */
  @Patch(':id')
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard())
  @ApiAcceptedResponse({description:'event updated'})
  @ApiForbiddenResponse({description:'Invalid id'})
  @ApiBody({type:CreateEventDto})
  @HttpCode(HttpStatus.OK)
  update(@Param('id') id: string, @Body() updateEventDto: UpdateEventDto) {
    this.logger.log(`update event with: ${id} and UpdatedEvent : ${updateEventDto}`);
    return this.eventService.update(id, updateEventDto);

  }

   /**
   * @Controller delete an event
   * @param id event id 
   * @throws notfound exception
   */
  @Delete(':id')
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard())
  @ApiOkResponse({description:'event is removed success'})
  @ApiNotFoundResponse({description:'Invalid Id'})
  @HttpCode(HttpStatus.OK)
  public async remove(@Param('id') id: string) {
    this.logger.log(`remove event by ${id} with event :${event}`);
    return  await this.eventService.remove(id);
  }

 

}

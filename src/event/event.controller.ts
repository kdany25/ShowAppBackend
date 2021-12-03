import { Controller, Get, Post, Body, Patch, Param, Delete, NotFoundException, Res, UseGuards, Logger, HttpCode, HttpStatus, ForbiddenException, HttpException, ParseUUIDPipe, Req } from '@nestjs/common';
import { EventService } from './event.service';
import { CancelEventDto, CreateEventDto} from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { ApiAcceptedResponse, ApiBearerAuth, ApiBody, ApiConflictResponse, ApiCreatedResponse, ApiForbiddenResponse, ApiNotFoundResponse, ApiOkResponse, ApiResponseProperty, ApiTags, ApiUnauthorizedResponse,  } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { GetUserFromRequest } from '../shared/decorators/user.decorator';
import { JwtService } from '@nestjs/jwt';
@Controller('event')
@ApiTags('Event')
export class EventController {
  private logger=new Logger('EventController');

  /**
   * @param eventService
   * @param jwtService
   */
  constructor( private eventService: EventService,private readonly jwtService: JwtService) {}

  /**
   * @Controller create a new event
   * @param createEventDto event details in body
   * @param organisationId current organisation
   * @param userRequest from jwt
   * @returns new event entity object
   * @throws unauthorized error
   */

   @ApiTags('x-user-journey')
  @Post(':organisationId')
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard())
  @ApiCreatedResponse({description:'the event has been created'})
  @ApiConflictResponse({description:'event already'})
  @ApiBody({type:CreateEventDto})
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createEventDto: CreateEventDto,@Param('organisationId',new ParseUUIDPipe()) organisationId:string,
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
  @ApiTags('x-user-journey')
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
  @ApiOkResponse({description:' events has been successfully returned '})
  @ApiForbiddenResponse({description:'Forbidden '})
  @HttpCode(HttpStatus.OK)
  async searchEvent(@Param('title') title:string ){
    this.logger.verbose(`Search ${title} `);
    if(title.match('[$#!@%^~.,|*()-=_+]')) throw new ForbiddenException ('search must not contain any special chars');
    return this.eventService.searchEvent(title);

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
  cancelEvent(@Param('id',new ParseUUIDPipe())id:string,@Body() cancelEventDto: CancelEventDto,@Req() request){
    this.logger.log(`cancel event by ${id}`);
    const jwt = request.headers.authorization.replace('Bearer ', '');
    const json = this.jwtService.decode(jwt, { json: true }) as { uuid: string };
    const userId=json['userId'];
    return this.eventService.cancelEvent(id,cancelEventDto,userId);

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
  getEventByOrganisation(@Param('id',new ParseUUIDPipe()) id:string){
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
  findOne(@Param('id',new ParseUUIDPipe()) id: string) {
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
  update(@Param('id',new ParseUUIDPipe()) id: string, @Body() updateEventDto: UpdateEventDto,@GetUserFromRequest('userId') userRequest:string) {
    this.logger.log(`update event with: ${id} and UpdatedEvent : ${updateEventDto}`);
    return this.eventService.update(id, updateEventDto,userRequest);

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
  public async remove(@Param('id',new ParseUUIDPipe()) id:string,@Req() request) {
    this.logger.log(`remove event by ${id}`);
    const jwt = request.headers.authorization.replace('Bearer ', '');
    const json = this.jwtService.decode(jwt, { json: true }) as { uuid: string };
    const userId=json['userId'];
    return  await this.eventService.remove(id,userId);
  }

 

}

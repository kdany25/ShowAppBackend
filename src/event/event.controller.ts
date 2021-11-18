import { Controller, Get, Post, Body, Patch, Param, Delete, ForbiddenException, Query, Res } from '@nestjs/common';
import { EventService } from './event.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { ApiAcceptedResponse, ApiBody, ApiCreatedResponse, ApiForbiddenResponse, ApiNotFoundResponse, ApiOkResponse, ApiResponseProperty, ApiTags, ApiUnauthorizedResponse,  } from '@nestjs/swagger';

@Controller('event')
@ApiTags('event')
export class EventController {
  constructor( private eventService: EventService) {}

  @Post()
  @ApiCreatedResponse({description:'the event has been created'})
  @ApiBody({type:CreateEventDto})
  create(@Body() createEventDto: CreateEventDto) {
    return this.eventService.create(createEventDto);
  }

  @Get()
  @ApiOkResponse({description:'the event list has been successfully returned '})
  @ApiForbiddenResponse({description:'Forbidden '})
  findAll() {
    return this.eventService.findAll();
  }

  @Get('search/:title')
  @ApiOkResponse({description:'Get  event By title has been successfully returned '})
  @ApiForbiddenResponse({description:'Forbidden '})
  async findByTitle(@Param('title') title:string ){
    return this.eventService.getByTitle(title);

  }

  
  @Patch('cancel/:id')
  @ApiAcceptedResponse({description:'Event has been updated successfully'})
  @ApiBody({type:UpdateEventDto})
  @ApiUnauthorizedResponse({description:'invalid credentials'})
  cancelEvent(@Param('id')id:string,@Body() updateEventDto: UpdateEventDto){
    return this.eventService.update(id,updateEventDto);
  }


  @Get('org/:id')
  @ApiOkResponse({description:'get events by organisation '})
  @ApiBody({ type:CreateEventDto})
  getEventByOrganisation(@Param('id') id:string){return this.eventService.getEventByOrganisationId(id);}
  @ApiNotFoundResponse({description:'the event no found'})
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.eventService.findOne(id);
  }

  @Patch(':id')
  @ApiAcceptedResponse({description:'event updated'})
  @ApiForbiddenResponse({description:'Invalid id'})
  @ApiBody({type:UpdateEventDto})
  update(@Param('id') id: string, @Body() updateEventDto: UpdateEventDto) {
    return this.eventService.update(id, updateEventDto);
  }

  @Delete(':id')
  @ApiOkResponse({description:'event is removed success'})
  @ApiNotFoundResponse({description:'Invalid Id'})
  remove(@Param('id') id: string) {
    return this.eventService.remove(id);
  }
}

/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Body, Patch, Param, Delete ,UseGuards} from '@nestjs/common';
import { TicketService } from './ticket.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GetUserFromRequests } from 'src/shared/decorators/user.decorator';
import { GetUserFromRequest } from 'src/shared/decorators/user.decorator';
import { AuthGuard } from '@nestjs/passport';
import { JwtPayload } from 'src/shared/interfaces';
import { EventService } from 'src/event/event.service';
import { tap } from 'rxjs';

@ApiTags('Ticket')
@Controller('/ticket')
export class TicketController {
  constructor(private readonly ticketService: TicketService , private readonly eventService : EventService) {}

@Post(':id')
@UseGuards(AuthGuard())
@ApiBearerAuth('access-token')
@ApiResponse({ status: 201, description: 'Ticket Created' })
@ApiResponse({ status: 404, description: 'Not found' })

 async create(@Body() createTicketDto: CreateTicketDto , @GetUserFromRequests() user , @Param('id')eventId:string) {
     return await this.ticketService.create(createTicketDto,eventId,user);
    
  }
  @Get()
  @UseGuards(AuthGuard())
  @ApiBearerAuth('access-token')
  @ApiResponse({ status: 200, description: 'fetch all ticket' })
  findAll(@GetUserFromRequest() user:JwtPayload ) {
    if(user.role == 'ORGANISER'){
     return this.ticketService.findAll();
    }else{
      return ' unauthorised access' ;
    }
  }


  @Get(':id')
  @UseGuards(AuthGuard())
  @ApiBearerAuth('access-token')
  @ApiResponse({ status: 200, description: 'fetch ticket by Id' })
  findOne(@Param('id') id: string , @GetUserFromRequest('userId') user:JwtPayload) {
    // if(user.userId ) {
    return this.ticketService.findOne(id);
    // }else{
    //   return 'ticket not yours'
    // }
  }

  @Patch(':id')
  @UseGuards(AuthGuard())
  @ApiBearerAuth('access-token')
  @ApiResponse({ status: 201, description: 'ticket Refunded' })
  update(@Param('id') id: string, @Body() updateTicketDto: UpdateTicketDto) {
    return this.ticketService.update(id, updateTicketDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard())
 @ApiBearerAuth('access-token')
  @ApiResponse({ status: 201, description: 'ticket deleted' })
  remove(@Param('id') id: string) {
    return this.ticketService.remove(+id);
  }
  
 @Get('qr/:id')
 @UseGuards(AuthGuard())
 @ApiBearerAuth('access-token')
 @ApiResponse({ status: 200, description: 'QR generated' })
 
 async generate(@Param('id') id: string) {
    return this.ticketService.generate(id)
  }
@Get('check/:id')
@UseGuards(AuthGuard())
@ApiBearerAuth('access-token')
@ApiResponse({ status: 200, description: 'ticket checking' })
@ApiResponse({ status: 404, description: 'Not found' })
  check(@Param('id') id: string) {
    return this.ticketService.check(id);
  }
  
}

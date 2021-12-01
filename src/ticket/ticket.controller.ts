/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Body, Patch, Param, Delete ,UseGuards} from '@nestjs/common';
import { TicketService } from './ticket.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { UpdateTicketUsedDto } from './dto/update-used-dto';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GetUserFromRequests } from '../shared/decorators/user.decorator';
import { GetUserFromRequest } from '../shared/decorators/user.decorator';
import { AuthGuard } from '@nestjs/passport';
import { JwtPayload } from '../shared/interfaces';
import { EventService } from '../event/event.service';

@ApiTags('Ticket')
@Controller('/ticket')

export class TicketController {
  //constructor
  constructor(private readonly ticketService: TicketService ,
  private readonly eventService : EventService) {}

  //creating ticket
  @Post(':id')
  @UseGuards(AuthGuard())
  @ApiBearerAuth('access-token')
  @ApiResponse({ status: 201, description: 'Ticket Created' })
  @ApiResponse({ status: 404, description: 'Not found' })
  async create(@Body() createTicketDto: CreateTicketDto,
  @GetUserFromRequests() user,
  @Param('id')eventId:string) {
  const ticket=  await this.ticketService.create(createTicketDto,eventId,user);
  this.ticketService.sendTicketMail(user.email,
    createTicketDto.seatCategory,
    createTicketDto.price,
    createTicketDto.seat_number,
    user.firstName ,
    user.lastName)
    return ticket;
}

  //Get all ticket
  @Get()
  @UseGuards(AuthGuard())
  @ApiBearerAuth('access-token')
  @ApiResponse({ status: 200, description: 'fetch all ticket' })
  findAll(@GetUserFromRequest() user:JwtPayload ) {
  if(user.role){
   return this.ticketService.findAll();
  }else{
      return ' unauthorised access' ;
  }
  }

  //Get ticket by Id  
  @Get(':id')
  @UseGuards(AuthGuard())
  @ApiBearerAuth('access-token')
  @ApiResponse({ status: 200, description: 'fetch ticket by Id' })
  findOne(@Param('id') id: string , @GetUserFromRequest('userId') user:JwtPayload) {
   return this.ticketService.findOne(id);
  }

  //Update ticket 
  @Patch(':id')
  @UseGuards(AuthGuard())
  @ApiBearerAuth('access-token')
  @ApiResponse({ status: 201, description: 'ticket Refunded' })
  update(@Param('id') id: string, @Body() updateTicketDto: UpdateTicketDto) {
   return this.ticketService.update(id, updateTicketDto);
  }

  //delete Ticket
  @Delete(':id')
  @UseGuards(AuthGuard())
  @ApiBearerAuth('access-token')
  @ApiResponse({ status: 201, description: 'ticket deleted' })
  remove(@Param('id') id: string) {
   return this.ticketService.remove(+id);
  }
  
  //Generate Qrcode
  @Get('qr/:id')
  @UseGuards(AuthGuard())
  @ApiBearerAuth('access-token')
  @ApiResponse({ status: 200, description: 'QR generated' })
  async generate(@Param('id') id: string) {
   return this.ticketService.generate(id)
  }

  //checking if ticket is not used
  @Patch('check/:id')
  @UseGuards(AuthGuard())
  @ApiBearerAuth('access-token')
  @ApiResponse({ status: 200, description: 'ticket checking' })
  @ApiResponse({ status: 404, description: 'Not found' })
  check(@Param('id') id: string, @Body() updateTicketusedDto: UpdateTicketUsedDto) {
   return this.ticketService.check(id ,updateTicketusedDto);
  }
  
}

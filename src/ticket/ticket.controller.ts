import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TicketService } from './ticket.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import {  ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Ticket')
@Controller('/ticket')
export class TicketController {
  constructor(private readonly ticketService: TicketService) {}

  @Post()
  @ApiResponse({ status: 201, description: 'Ticket Created' })
  @ApiResponse({ status: 404, description: 'Not found' })
  create(@Body() createTicketDto: CreateTicketDto) {
    return this.ticketService.create(createTicketDto);
  }

  @Get()
  @ApiResponse({ status: 200, description: 'fetch all ticket' })
  findAll() {
    return this.ticketService.findAll();
  }

  @Get(':id')
  @ApiResponse({ status: 200, description: 'fetch ticket by Id' })
  findOne(@Param('id') id: string) {
    return this.ticketService.findOne(id);
  }

  @Patch(':id')
  @ApiResponse({ status: 201, description: 'ticket Refunded' })
  update(@Param('id') id: string, @Body() updateTicketDto: UpdateTicketDto) {
    return this.ticketService.update(id, updateTicketDto);
  }

  @Delete(':id')
  @ApiResponse({ status: 201, description: 'ticket deleted' })
  remove(@Param('id') id: string) {
    return this.ticketService.remove(+id);
  }
  
 @Get('qr/:id')
 @ApiResponse({ status: 200, description: 'QR generated' })
 
 async generate(@Param('id') id: string) {
    return this.ticketService.generate(id)
  }
@Get('check/:id')
@ApiResponse({ status: 200, description: 'ticket checking' })
@ApiResponse({ status: 404, description: 'Not found' })
  check(@Param('id') id: string) {
    return this.ticketService.check(id);
  }
  
}

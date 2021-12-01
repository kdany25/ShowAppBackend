import { Test } from "@nestjs/testing";
import { UserService } from "../../user/user.service";
import { OrganisationService } from "../../organisation/organisation.service";
import { EventController } from "../event.controller";
import { EventService } from "../event.service";
import { eventStub } from "./stubs/event.stub";
import {Organisation } from '../../organisation/entities/organisation.entity';
import { OrganisationModule } from "../../organisation/organisation.module";
import { UserModule } from "../../user/user.module";

jest.mock('../event.service')
describe('EventController',()=>{
  let eventController:EventController;
  let eventService:EventService;
  let organisationService:OrganisationService;
  let userService:UserService;
  beforeEach(async()=>{
    const moduleRef= await   Test.createTestingModule({
      
      imports:[OrganisationModule,UserModule],
      controllers:[EventController],
      providers:[EventService,OrganisationService,UserService],

    }).compile();

    eventController=moduleRef.get<EventController>(EventController);
    eventService=moduleRef.get<EventService>(EventService);
    jest.clearAllMocks();
  })

  describe('findOne',()=>{
    describe('when findOne is called ',()=>{
      let event:Event;
      beforeEach(() =>{
         eventController.findOne(eventStub().eventId);  
      })
      test('then it should call eventService',() => {
        expect(eventService.findOne).toBeCalledWith(eventStub().eventId)
      })
    })
  })
})
import { eventStub } from "../event/test/stubs/event.stub";

export const EventService =jest.fn().mockReturnValue({
   create:jest.fn().mockResolvedValue(eventStub),
   findAll:jest.fn().mockResolvedValue([{eventStub}]),
   getByTitle:jest.fn().mockResolvedValue(eventStub),
   findOne:jest.fn().mockResolvedValue(eventStub),
   update:jest.fn().mockResolvedValue(eventStub)
})
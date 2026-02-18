import { Controller, Get } from "@nestjs/common";
import { EventsService } from "./events.service.js";
import { ApiTags, ApiOperation } from "@nestjs/swagger";

@ApiTags("events")
@Controller("events")
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Get()
  @ApiOperation({ summary: "Get recent blockchain events" })
  async getEvents() {
    return this.eventsService.getEvents();
  }
}

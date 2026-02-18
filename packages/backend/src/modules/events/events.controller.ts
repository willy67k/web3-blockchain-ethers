import { Controller, Get, Post, Body } from "@nestjs/common";
import { EventsService } from "./events.service.js";
import { ApiTags, ApiOperation } from "@nestjs/swagger";
import { QueryEventsDto } from "./dto/query-events.dto.js";

@ApiTags("events")
@Controller("events")
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Get()
  @ApiOperation({ summary: "Get recent blockchain events" })
  getEvents() {
    return this.eventsService.getEvents();
  }

  @Post("query")
  @ApiOperation({ summary: "Query historical blockchain events using filter" })
  queryEvents(@Body() query: QueryEventsDto) {
    return this.eventsService.queryEvents(query);
  }
}

import { Controller, Get, Post, Body, Patch, Param } from '@nestjs/common';
import { TripService } from './trip.service';
import { CreateTripDto } from './dto/create-trip.dto';

@Controller('trip')
export class TripController {
  constructor(private readonly tripService: TripService) {}

  @Post()
  create(@Body() createTripDto: CreateTripDto) {
    return this.tripService.create(createTripDto);
  }

  @Get()
  findAvailable() {
    return this.tripService.findAllActive();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tripService.findOne(+id);
  }

  @Patch(':id')
  complete(@Param('id') id: string) {
    return this.tripService.complete(+id);
  }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.tripService.remove(+id);
  // }
}

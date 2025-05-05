import { Controller, Get, Post, Body, Patch, Param } from '@nestjs/common';
import { TripService } from './trip.service';
import { Trip } from './entities/trip.entity';
import { LocationDto } from '../common/dto/location.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('trips')
@Controller('trips')
export class TripController {
  constructor(private readonly tripService: TripService) {}

  @ApiOperation({ summary: 'Create a new trip' })
  @Post()
  create(
    @Body('passengerId') passengerId: number,
    @Body('driverId') driverId: number,
    @Body('startingPoint') startingPoint: LocationDto,
    @Body('endPoint') endPoint: LocationDto,
  ): Promise<Trip> {
    return this.tripService.create(
      passengerId,
      driverId,
      startingPoint,
      endPoint,
    );
  }

  @ApiOperation({ summary: 'Get all active trips' })
  @Get('active')
  findAllActive(): Promise<Trip[]> {
    return this.tripService.findAllActive();
  }

  @ApiOperation({ summary: 'Complete a trip' })
  @Patch(':id/complete')
  complete(@Param('id') id: string): Promise<Trip> {
    return this.tripService.complete(+id);
  }

  @ApiOperation({ summary: 'Calculate trip distance in meters' })
  @Get(':id/distance')
  calculateDistance(@Param('id') id: string): Promise<number> {
    return this.tripService.calculateDistance(+id);
  }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.tripService.remove(+id);
  // }
}

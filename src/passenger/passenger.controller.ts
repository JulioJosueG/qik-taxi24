import { Controller, Get, Param, Query } from '@nestjs/common';
import { PassengerService } from './passenger.service';
import { Passenger } from './entities/passenger.entity';
import { Driver } from '../driver/entities/driver.entity';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('passengers')
@Controller('passengers')
export class PassengerController {
  constructor(private readonly passengerService: PassengerService) {}

  @Get()
  findAll(): Promise<Passenger[]> {
    return this.passengerService.findAll();
  }
  @ApiOperation({ summary: 'Find the 3 closest available drivers' })
  @Get('close-drivers')
  findCloseDrivers(
    @Query('latitude') latitude: number,
    @Query('longitude') longitude: number,
  ): Promise<Driver[]> {
    return this.passengerService.findCloseDrivers(latitude, longitude);
  }
  @Get(':id')
  findOne(@Param('id') id: string): Promise<Passenger> {
    return this.passengerService.findOne(+id);
  }
}

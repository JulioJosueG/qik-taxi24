import { Controller, Get, Param, Query } from '@nestjs/common';
import { PassengerService } from './passenger.service';
import { Passenger } from './entities/passenger.entity';
import { Driver } from '../driver/entities/driver.entity';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('passengers')
@Controller('passengers')
export class PassengerController {
  constructor(private readonly passengerService: PassengerService) {}

  // @Post()
  // create(@Body() createPassengerDto: CreatePassengerDto) {
  //   return this.passengerService.create(createPassengerDto);
  // }

  @Get()
  findAll(): Promise<Passenger[]> {
    return this.passengerService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Passenger> {
    return this.passengerService.findOne(+id);
  }

  @ApiOperation({ summary: 'Find the 3 closest available drivers' })
  @Get('close-drivers')
  findCloseDrivers(
    @Query('lat') latitude: number,
    @Query('lng') longitude: number,
  ): Promise<Driver[]> {
    return this.passengerService.findCloseDrivers(latitude, longitude);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updatePassengerDto: UpdatePassengerDto) {
  //   return this.passengerService.update(+id, updatePassengerDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.passengerService.remove(+id);
  // }
}

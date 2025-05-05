import { Controller, Get, Param } from '@nestjs/common';
import { PassengerService } from './passenger.service';

@Controller('passenger')
export class PassengerController {
  constructor(private readonly passengerService: PassengerService) {}

  // @Post()
  // create(@Body() createPassengerDto: CreatePassengerDto) {
  //   return this.passengerService.create(createPassengerDto);
  // }

  @Get()
  findAll() {
    return this.passengerService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.passengerService.findOne(+id);
  }
  @Get()
  findCloseDrivers(@Param('startingPoint') startingPoint: string) {
    return this.passengerService.findCloseDrivers(startingPoint);
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

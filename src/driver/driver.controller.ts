import { Controller, Get, Param, Query } from '@nestjs/common';
import { DriverService } from './driver.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('drivers')
@Controller('driver')
export class DriverController {
  constructor(private readonly driverService: DriverService) {}

  // @Post()
  // create(@Body() createDriverDto: CreateDriverDto) {
  //   return this.driverService.create(createDriverDto);
  // }
  @Get('findAll')
  findAll() {
    return this.driverService.findAll();
  }
  @ApiOperation({ summary: 'Search all available drivers' })
  @Get('findAllAvailableDrivers/:id')
  findAllAvailable() {
    return this.driverService.findAllAvailableDrivers();
  }

  @Get('findAllAvailableAtLocation')
  findAllAvailableAtLocation(@Query('location') location: string) {
    return this.driverService.findAllAvailableDriversAtLocation(location);
  }

  @Get('findOne/:id')
  findOne(@Param('id') id: string) {
    return this.driverService.findOne(+id);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateDriverDto: UpdateDriverDto) {
  //   return this.driverService.update(+id, updateDriverDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.driverService.remove(+id);
  // }
}

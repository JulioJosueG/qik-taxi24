import { Controller, Get, Param, Query } from '@nestjs/common';
import { DriverService } from './driver.service';
import { Driver } from './entities/driver.entity';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('drivers')
@Controller('drivers')
export class DriverController {
  constructor(private readonly driverService: DriverService) {}

  @Get()
  findAll(): Promise<Driver[]> {
    return this.driverService.findAll();
  }

  @Get('available')
  findAvailable(): Promise<Driver[]> {
    return this.driverService.findAvailable();
  }

  @Get('available/nearby')
  findAvailableInRadius(
    @Query('lat') latitude: number,
    @Query('lng') longitude: number,
  ): Promise<Driver[]> {
    return this.driverService.findAvailableInRadius(latitude, longitude);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Driver> {
    return this.driverService.findOne(+id);
  }

  // @Post()
  // create(@Body() createDriverDto: CreateDriverDto) {
  //   return this.driverService.create(createDriverDto);
  // }

  @ApiOperation({ summary: 'Search all available drivers' })
  @Get('findAllAvailableDrivers/:id')
  findAllAvailable() {
    return this.driverService.findAllAvailableDrivers();
  }

  @Get('findAllAvailableAtLocation')
  findAllAvailableAtLocation(@Query('location') location: string) {
    return this.driverService.findAllAvailableDriversAtLocation(location);
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

import { Controller, Get, Param, Query, Patch, Body } from '@nestjs/common';
import { DriverService } from './driver.service';
import { Driver } from './entities/driver.entity';
import { LocationDto } from '../common/dto/location.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('drivers')
@Controller('drivers')
export class DriverController {
  constructor(private readonly driverService: DriverService) {}

  @Get()
  findAll(): Promise<Driver[]> {
    return this.driverService.findAll();
  }

  @ApiOperation({ summary: 'Search all available drivers' })
  @Get('findAllAvailableDrivers')
  findAllAvailable(): Promise<Driver[]> {
    return this.driverService.findAvailable();
  }

  @ApiOperation({ summary: 'Find available drivers within 3km radius' })
  @Get('available/nearby')
  findAvailableInRadius(@Query() location: LocationDto): Promise<Driver[]> {
    return this.driverService.findAvailableInRadius(location);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Driver> {
    return this.driverService.findOne(+id);
  }

  @ApiOperation({ summary: 'Update driver location' })
  @Patch(':id/location')
  updateLocation(
    @Param('id') id: string,
    @Body() location: LocationDto,
  ): Promise<Driver> {
    return this.driverService.updateLocation(+id, location);
  }
}

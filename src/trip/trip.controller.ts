import { Controller, Get, Post, Body, Patch, Param, Res } from '@nestjs/common';
import { TripService } from './trip.service';
import { Trip } from './entities/trip.entity';
import { LocationDto } from '../common/dto/location.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

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

  @ApiOperation({ summary: 'Complete a trip and get invoice PDF' })
  @Patch('complete/:id')
  async complete(@Param('id') id: string, @Res() res: Response): Promise<void> {
    const invoice = await this.tripService.complete(+id);

    const pdfBuffer = await this.tripService.generateInvoicePDF(invoice);

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename=invoice-${invoice.id}.pdf`,
      'Content-Length': pdfBuffer.length,
    });

    res.send(pdfBuffer);
  }

  @ApiOperation({ summary: 'Calculate trip distance in meters' })
  @Get('distance/:id')
  calculateDistance(@Param('id') id: string): Promise<number> {
    return this.tripService.calculateDistance(+id);
  }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.tripService.remove(+id);
  // }
}

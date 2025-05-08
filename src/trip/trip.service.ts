import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Trip } from './entities/trip.entity';
import { Point } from 'geojson';
import { LocationDto } from '../common/dto/location.dto';
import { TripStatus } from './entities/trip.entity';
import { InvoiceService } from '../invoice/invoice.service';
import { Invoice } from '../invoice/entities/invoice.entity';
import { DriverService } from '../driver/driver.service';

@Injectable()
export class TripService {
  private readonly logger = new Logger(TripService.name);

  constructor(
    @InjectRepository(Trip)
    private tripRepository: Repository<Trip>,
    private invoiceService: InvoiceService,
    private driverService: DriverService,
  ) {}

  async create(
    passengerId: number,
    driverId: number,
    startingPoint: LocationDto,
    endPoint: LocationDto,
  ): Promise<Trip> {
    this.logger.log(
      `Creating new trip for passenger ${passengerId} with driver ${driverId}`,
    );
    // Check if driver is available
    const driver = await this.driverService.findOne(driverId);
    if (!driver.isAvailable) {
      throw new Error('Driver is not available');
    }

    const startPointGeo: Point = {
      type: 'Point',
      coordinates: [startingPoint.lng, startingPoint.lat],
    };

    const endPointGeo: Point = {
      type: 'Point',
      coordinates: [endPoint.lng, endPoint.lat],
    };

    if (startPointGeo.coordinates == endPointGeo.coordinates) {
      throw new Error('Starting and ending points are the same');
    }

    // Set driver as unavailable
    await this.driverService.updateAvailability(driverId, false);

    const trip = this.tripRepository.create({
      passengerId,
      driverId,
      startingPoint: startPointGeo,
      endPoint: endPointGeo,
      tripStatus: TripStatus.ACTIVE,
    });

    return this.tripRepository.save(trip);
  }

  findAllActive(): Promise<Trip[]> {
    this.logger.log('Finding all active trips');
    return this.tripRepository.find({
      where: { tripStatus: TripStatus.ACTIVE },
    });
  }

  async complete(id: number): Promise<Invoice> {
    this.logger.log(`Completing trip ${id}`);
    const trip = await this.tripRepository.findOne({ where: { id } });
    if (!trip) {
      throw new Error('Trip not found');
    }
    if (trip.tripStatus == TripStatus.COMPLETE) {
      throw new Error('Trip is already completed');
    }

    await this.tripRepository.update(id, {
      tripStatus: TripStatus.COMPLETE,
    });

    // Update driver location and set as available
    await this.driverService.updateLocationAndAvailability(
      trip.driverId,
      trip.endPoint,
      true,
    );

    const distance = await this.calculateDistance(id);
    return this.invoiceService.createFromTrip(trip, distance);
  }

  async generateInvoicePDF(invoice: Invoice): Promise<Buffer> {
    this.logger.log(`Generating PDF for invoice ${invoice.id}`);
    return this.invoiceService.generatePDF(invoice);
  }

  async calculateDistance(tripId: number): Promise<number> {
    this.logger.log(`Calculating distance for trip ${tripId}`);
    const trip = await this.tripRepository.findOne({ where: { id: tripId } });
    if (!trip) {
      throw new Error('Trip not found');
    }

    const result = await this.tripRepository
      .createQueryBuilder('trip')
      .select('ST_Distance(trip.startingPoint, trip.endPoint) as distance')
      .where('trip.id = :id', { id: tripId })
      .getRawOne();

    return result.distance;
  }

  // remove(id: number) {
  //   return `This action removes a #${id} trip`;
  // }
}

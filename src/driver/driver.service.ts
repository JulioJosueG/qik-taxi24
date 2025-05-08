import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Driver } from './entities/driver.entity';
import { Point } from 'geojson';
import { LocationDto } from '../common/dto/location.dto';

@Injectable()
export class DriverService {
  private readonly logger = new Logger(DriverService.name);

  constructor(
    @InjectRepository(Driver)
    private driverRepository: Repository<Driver>,
  ) {}

  findAll(): Promise<Driver[]> {
    this.logger.log('Finding all drivers');
    return this.driverRepository.find();
  }

  findAvailable(): Promise<Driver[]> {
    this.logger.log('Finding available drivers');
    return this.driverRepository.find({ where: { isAvailable: true } });
  }

  findAvailableInRadius(location: LocationDto): Promise<Driver[]> {
    this.logger.log(
      `Finding available drivers within radius of location: ${JSON.stringify(location)}`,
    );
    const point: Point = {
      type: 'Point',
      coordinates: [location.lng, location.lat],
    };

    return this.driverRepository
      .createQueryBuilder('driver')
      .where('driver.isAvailable = :isAvailable', { isAvailable: true })
      .andWhere(
        'ST_DWithin(driver.location, ST_SetSRID(ST_GeomFromGeoJSON(:point), 4326), 3000)',
      )
      .setParameter('point', JSON.stringify(point))
      .getMany();
  }

  findOne(id: number): Promise<Driver> {
    this.logger.log(`Finding driver with id: ${id}`);
    return this.driverRepository.findOne({ where: { id } });
  }

  async updateLocation(id: number, location: LocationDto): Promise<Driver> {
    this.logger.log(
      `Updating location for driver ${id} to: ${JSON.stringify(location)}`,
    );
    const point: Point = {
      type: 'Point',
      coordinates: [location.lng, location.lat],
    };

    await this.driverRepository.update(id, { location: point });
    return this.findOne(id);
  }

  async updateAvailability(id: number, isAvailable: boolean): Promise<Driver> {
    this.logger.log(
      `Updating availability for driver ${id} to: ${isAvailable}`,
    );
    await this.driverRepository.update(id, { isAvailable });
    return this.findOne(id);
  }

  async updateLocationAndAvailability(
    id: number,
    location: Point,
    isAvailable: boolean,
  ): Promise<Driver> {
    this.logger.log(
      `Updating location and availability for driver ${id} to location: ${JSON.stringify(location)}, available: ${isAvailable}`,
    );
    await this.driverRepository.update(id, { location, isAvailable });
    return this.findOne(id);
  }
}

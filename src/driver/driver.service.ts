import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Driver } from './entities/driver.entity';
import { Point } from 'geojson';
import { LocationDto } from '../common/dto/location.dto';

@Injectable()
export class DriverService {
  constructor(
    @InjectRepository(Driver)
    private driverRepository: Repository<Driver>,
  ) {}

  // create(createDriverDto: CreateDriverDto) {
  //   return this.driversRepository.create(createDriverDto);
  // }

  findAll(): Promise<Driver[]> {
    return this.driverRepository.find();
  }

  findAvailable(): Promise<Driver[]> {
    return this.driverRepository.find({ where: { isAvailable: true } });
  }

  findAvailableInRadius(location: LocationDto): Promise<Driver[]> {
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
    return this.driverRepository.findOne({ where: { id } });
  }

  // update(id: number, updateDriverDto: UpdateDriverDto) {
  //   return this.driversRepository.update(id, updateDriverDto);
  // }

  // remove(id: number) {
  //   return this.driversRepository.delete(id);
  // }

  async updateLocation(id: number, location: LocationDto): Promise<Driver> {
    const point: Point = {
      type: 'Point',
      coordinates: [location.lng, location.lat],
    };

    await this.driverRepository.update(id, { location: point });
    return this.findOne(id);
  }
}

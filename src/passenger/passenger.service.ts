import { Injectable, Logger } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Passenger } from './entities/passenger.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Driver } from '../driver/entities/driver.entity';
import { Point } from 'geojson';

@Injectable()
export class PassengerService {
  private readonly logger = new Logger(PassengerService.name);

  constructor(
    @InjectRepository(Passenger)
    private passengerRepository: Repository<Passenger>,
    @InjectRepository(Driver)
    private driverRepository: Repository<Driver>,
  ) {}

  // create(createPassengerDto: CreatePassengerDto) {
  //   return 'This action adds a new passenger';
  // }

  findAll(): Promise<Passenger[]> {
    this.logger.log('Finding all passengers');
    return this.passengerRepository.find();
  }

  findOne(id: number): Promise<Passenger> {
    this.logger.log(`Finding passenger with id: ${id}`);
    return this.passengerRepository.findOne({ where: { id } });
  }

  async findCloseDrivers(
    latitude: number,
    longitude: number,
  ): Promise<Driver[]> {
    this.logger.log(
      `Finding close drivers for location: ${latitude}, ${longitude}`,
    );
    const point: Point = {
      type: 'Point',
      coordinates: [longitude, latitude],
    };

    return this.driverRepository
      .createQueryBuilder('driver')
      .where('driver.isAvailable = :isAvailable', { isAvailable: true })
      .orderBy(
        'ST_Distance(driver.location, ST_SetSRID(ST_GeomFromGeoJSON(:point), 4326))',
        'ASC',
      )
      .setParameter('point', JSON.stringify(point))
      .limit(3)
      .getMany();
  }

  // remove(id: number) {
  //   return `This action removes a #${id} passenger`;
  // }
}

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Trip } from './entities/trip.entity';
import { Point } from 'geojson';
import { LocationDto } from '../common/dto/location.dto';
import { TripStatus } from './entities/trip.entity';

@Injectable()
export class TripService {
  constructor(
    @InjectRepository(Trip)
    private tripRepository: Repository<Trip>,
  ) {}

  async create(
    passengerId: number,
    driverId: number,
    startingPoint: LocationDto,
    endPoint: LocationDto,
  ): Promise<Trip> {
    const startPoint: Point = {
      type: 'Point',
      coordinates: [startingPoint.lng, startingPoint.lat],
    };

    const endPointGeo: Point = {
      type: 'Point',
      coordinates: [endPoint.lng, endPoint.lat],
    };

    const trip = this.tripRepository.create({
      passengerId,
      driverId,
      startingPoint: startPoint,
      endPoint: endPointGeo,
      tripStatus: TripStatus.ACTIVE,
    });

    return this.tripRepository.save(trip);
  }

  findAllActive(): Promise<Trip[]> {
    return this.tripRepository.find({
      where: { tripStatus: TripStatus.ACTIVE },
    });
  }

  async complete(id: number): Promise<Trip> {
    await this.tripRepository.update(id, {
      tripStatus: TripStatus.COMPLETE,
    });
    return this.tripRepository.findOne({ where: { id } });
  }

  async calculateDistance(tripId: number): Promise<number> {
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

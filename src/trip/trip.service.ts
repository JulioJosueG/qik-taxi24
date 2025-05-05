import { Injectable } from '@nestjs/common';
import { CreateTripDto } from './dto/create-trip.dto';
import { Trip, TripStatus } from './entities/trip.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class TripService {
  constructor(
    @InjectRepository(Trip)
    private tripsRepository: Repository<Trip>,
  ) {}

  create(createTripDto: CreateTripDto) {
    return this.tripsRepository.save(createTripDto);
  }

  findAllActive() {
    return this.tripsRepository.findBy({ tripStatus: TripStatus.ACTIVE });
  }

  findOne(id: number) {
    return this.tripsRepository.findOneBy({ id });
  }

  complete(id: number) {
    return this.tripsRepository.update(
      { id },
      { tripStatus: TripStatus.COMPLETE },
    );
  }

  // remove(id: number) {
  //   return `This action removes a #${id} trip`;
  // }
}

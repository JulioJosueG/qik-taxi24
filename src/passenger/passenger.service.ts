import { Injectable } from '@nestjs/common';
import { LessThan, Repository } from 'typeorm';
import { Passenger } from './entities/passenger.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class PassengerService {
  constructor(
    @InjectRepository(Passenger)
    private passengerRepository: Repository<Passenger>,
  ) {}

  // create(createPassengerDto: CreatePassengerDto) {
  //   return 'This action adds a new passenger';
  // }

  findAll() {
    return this.passengerRepository.find();
  }

  findOne(id: number) {
    return this.passengerRepository.findOneBy({ id });
  }

  findCloseDrivers(startingPoint: string) {
    // return this.driverRepository.find({
    //   where: { location: LessThan(startingPoint) },
    // });
    return '';
  }

  // remove(id: number) {
  //   return `This action removes a #${id} passenger`;
  // }
}

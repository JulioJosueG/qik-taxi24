import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Driver } from './entities/driver.entity';
import { LessThan, Repository } from 'typeorm';

@Injectable()
export class DriverService {
  constructor(
    @InjectRepository(Driver)
    private driversRepository: Repository<Driver>,
  ) {}

  // create(createDriverDto: CreateDriverDto) {
  //   return this.driversRepository.create(createDriverDto);
  // }

  findAll(): Promise<Driver[]> {
    return this.driversRepository.find();
  }

  findAllAvailableDrivers(): Promise<Driver[]> {
    return this.driversRepository.findBy({ isAvailable: true });
  }

  findAllAvailableDriversAtLocation(location: string): Promise<Driver[]> {
    return this.driversRepository.find({
      where: {
        location: LessThan(location),
      },
    });
  }

  findOne(id: number) {
    return this.driversRepository.findOneBy({ id });
  }

  // update(id: number, updateDriverDto: UpdateDriverDto) {
  //   return this.driversRepository.update(id, updateDriverDto);
  // }

  // remove(id: number) {
  //   return this.driversRepository.delete(id);
  // }
}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeederService } from './seeder.service';
import { Driver } from '../../driver/entities/driver.entity';
import { Passenger } from '../../passenger/entities/passenger.entity';
import { Trip } from '../../trip/entities/trip.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Driver, Passenger, Trip])],
  providers: [SeederService],
  exports: [SeederService],
})
export class SeederModule {}

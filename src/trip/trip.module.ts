import { Module } from '@nestjs/common';
import { TripService } from './trip.service';
import { TripController } from './trip.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Trip } from './entities/trip.entity';
import { InvoiceModule } from '../invoice/invoice.module';
import { DriverModule } from 'src/driver/driver.module';

@Module({
  imports: [TypeOrmModule.forFeature([Trip]), InvoiceModule, DriverModule],
  controllers: [TripController],
  providers: [TripService],
})
export class TripModule {}

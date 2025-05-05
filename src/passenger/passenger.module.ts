import { Module } from '@nestjs/common';
import { PassengerService } from './passenger.service';
import { PassengerController } from './passenger.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Passenger } from './entities/passenger.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Passenger])],
  controllers: [PassengerController],
  providers: [PassengerService],
})
export class PassengerModule {}

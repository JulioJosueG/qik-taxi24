import { Module } from '@nestjs/common';
import { DriverModule } from './driver/driver.module';
import { TripModule } from './trip/trip.module';
import { PassengerModule } from './passenger/passenger.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import typeorm from './config/typeorm';
import { SeedCommand, SeederModule } from './database/seeder';

@Module({
  imports: [
    DriverModule,
    TripModule,
    PassengerModule,
    SeederModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [typeorm],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) =>
        configService.get('typeorm'),
    }),
  ],
  providers: [SeedCommand],
})
export class AppModule {}

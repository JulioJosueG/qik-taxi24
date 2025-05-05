import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Driver } from '../../driver/entities/driver.entity';
import { Passenger } from '../../passenger/entities/passenger.entity';
import { Trip, TripStatus } from '../../trip/entities/trip.entity';
import { Point } from 'geojson';

@Injectable()
export class SeederService {
  constructor(
    @InjectRepository(Driver)
    private driverRepository: Repository<Driver>,
    @InjectRepository(Passenger)
    private passengerRepository: Repository<Passenger>,
    @InjectRepository(Trip)
    private tripRepository: Repository<Trip>,
  ) {}

  async seed() {
    await this.seedDrivers();
    await this.seedPassengers();
    await this.seedTrips();
    return { message: 'Database seeded successfully!' };
  }

  async seedDrivers() {
    const driversCount = await this.driverRepository.count();

    // Only seed if no drivers exist
    if (driversCount === 0) {
      const drivers = [];

      // Create 10 sample drivers in New York City area
      for (let i = 1; i <= 10; i++) {
        // Generate a location within NYC region
        // Approximately Manhattan area
        const lat = 40.7128 + (Math.random() - 0.5) * 0.05;
        const lng = -74.006 + (Math.random() - 0.5) * 0.05;

        const location: Point = {
          type: 'Point',
          coordinates: [lng, lat],
        };

        drivers.push({
          name: `Driver ${i}`,
          telephone: `+1-555-${100 + i}`,
          dni: `D${1000 + i}`,
          isAvailable: Math.random() > 0.3, // 70% chance of being available
          location,
        });
      }

      await this.driverRepository.save(drivers);
      console.log(`Created ${drivers.length} drivers`);
    }
  }

  async seedPassengers() {
    const passengersCount = await this.passengerRepository.count();

    // Only seed if no passengers exist
    if (passengersCount === 0) {
      const passengers = [];

      // Create 20 sample passengers
      for (let i = 1; i <= 20; i++) {
        passengers.push({
          name: `Passenger ${i}`,
          email: `passenger${i}@example.com`,
          phone: `+1-555-${200 + i}`,
        });
      }

      await this.passengerRepository.save(passengers);
      console.log(`Created ${passengers.length} passengers`);
    }
  }

  async seedTrips() {
    const tripsCount = await this.tripRepository.count();

    // Only seed if no trips exist
    if (tripsCount === 0) {
      const drivers = await this.driverRepository.find();
      const passengers = await this.passengerRepository.find();

      if (drivers.length === 0 || passengers.length === 0) {
        return;
      }

      const trips = [];

      // Create 5 sample trips
      for (let i = 1; i <= 5; i++) {
        const driver = drivers[Math.floor(Math.random() * drivers.length)];
        const passenger =
          passengers[Math.floor(Math.random() * passengers.length)];

        // Generate random points for starting and ending locations
        const startLat = 40.7128 + (Math.random() - 0.5) * 0.1;
        const startLng = -74.006 + (Math.random() - 0.5) * 0.1;
        const endLat = 40.7128 + (Math.random() - 0.5) * 0.1;
        const endLng = -74.006 + (Math.random() - 0.5) * 0.1;

        const startingPoint: Point = {
          type: 'Point',
          coordinates: [startLng, startLat],
        };

        const endPoint: Point = {
          type: 'Point',
          coordinates: [endLng, endLat],
        };

        // Some trips are active, some are complete
        const status = i <= 3 ? TripStatus.ACTIVE : TripStatus.COMPLETE;

        trips.push({
          passengerId: passenger.id,
          driverId: driver.id,
          startingPoint,
          endPoint,
          tripStatus: status,
        });
      }

      await this.tripRepository.save(trips);
      console.log(`Created ${trips.length} trips`);
    }
  }
}

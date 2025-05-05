import { Trip } from '../../trip/entities/trip.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Point } from 'geojson';

@Entity()
export class Driver {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  telephone: string;

  @Column()
  dni: string;

  @Column({ default: true })
  isAvailable: boolean;

  @Column({
    type: 'geometry',
    spatialFeatureType: 'Point',
    srid: 4326,
  })
  location: Point;

  @OneToMany(() => Trip, (trip) => trip.driverId)
  trips: Trip[];
}

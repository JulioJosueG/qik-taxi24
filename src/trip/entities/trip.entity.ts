import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Point } from 'geojson';

export enum TripStatus {
  ACTIVE = 'active',
  COMPLETE = 'complete',
}

@Entity()
export class Trip {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  passengerId: number;

  @Column()
  driverId: number;

  @Column({
    type: 'geometry',
    spatialFeatureType: 'Point',
    srid: 4326,
  })
  startingPoint: Point;

  @Column({
    type: 'geometry',
    spatialFeatureType: 'Point',
    srid: 4326,
  })
  endPoint: Point;

  @Column({
    type: 'enum',
    enum: TripStatus,
    default: TripStatus.ACTIVE,
  })
  tripStatus: TripStatus;
}

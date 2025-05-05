import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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

  @Column()
  startingPoint: string;

  @Column()
  endPoint: string;

  @Column({
    type: 'enum',
    enum: TripStatus,
    default: TripStatus.ACTIVE,
  })
  tripStatus: TripStatus;
}

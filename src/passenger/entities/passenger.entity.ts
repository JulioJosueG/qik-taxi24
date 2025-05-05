import { Trip } from '../../trip/entities/trip.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Passenger {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => Trip, (trip) => trip.driverId)
  trips: Trip[];
}

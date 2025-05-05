import { Trip } from '../../trip/entities/trip.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

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

  @Column()
  location: string;

  @OneToMany(() => Trip, (trip) => trip.driverId)
  trips: Trip[];
}

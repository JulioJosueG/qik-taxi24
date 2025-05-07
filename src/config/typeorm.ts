import { registerAs } from '@nestjs/config';
import { config as dotenvConfig } from 'dotenv';
import { Driver } from '../driver/entities/driver.entity';
import { Passenger } from '../passenger/entities/passenger.entity';
import { Trip } from '../trip/entities/trip.entity';
import { DataSource, DataSourceOptions } from 'typeorm';
import { Invoice } from '../invoice/entities/invoice.entity';

dotenvConfig({ path: '.env' });

const config = {
  type: 'postgres',
  host: `${process.env.DATABASE_HOST}`,
  port: `${process.env.DATABASE_PORT}`,
  username: `${process.env.DATABASE_USERNAME}`,
  password: `${process.env.DATABASE_PASSWORD}`,
  database: `${process.env.DATABASE_NAME}`,
  entities: [Driver, Passenger, Trip, Invoice],
  migrations: ['dist/migrations/*{.ts,.js}'],
  synchronize: true,
};

export default registerAs('typeorm', () => config);
export const connectionSource = new DataSource(config as DataSourceOptions);

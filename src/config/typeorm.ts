import { registerAs } from '@nestjs/config';
import { config as dotenvConfig } from 'dotenv';
import { Driver } from 'src/driver/entities/driver.entity';
import { Passenger } from 'src/passenger/entities/passenger.entity';
import { Trip } from 'src/trip/entities/trip.entity';
import { DataSource, DataSourceOptions } from 'typeorm';

dotenvConfig({ path: '.env' });

const config = {
  type: 'postgres',
  host: `${process.env.DATABASE_HOST}`,
  port: `${process.env.DATABASE_PORT}`,
  username: `${process.env.DATABASE_USERNAME}`,
  password: `${process.env.DATABASE_PASSWORD}`,
  database: `${process.env.DATABASE_NAME}`,
  entities: [Driver, Passenger, Trip],
  migrations: ['src/migrations/*{.ts,.js}'],
  synchronize: false,
};

export default registerAs('typeorm', () => config);
export const connectionSource = new DataSource(config as DataSourceOptions);

# Taxi24 - Taxi Service Management System

A NestJS-based taxi service management system that handles trips, drivers, passengers, and invoicing with geospatial capabilities.

## Features

- Real-time driver location tracking
- Trip management with geospatial data
- Driver and passenger management
- Automated invoice generation
- Distance calculation using PostGIS
- PDF invoice generation

## Prerequisites

- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- PostGIS extension

## Database Setup

1. Install PostgreSQL and PostGIS:
   ```bash
   # For Ubuntu/Debian
   sudo apt-get install postgresql postgresql-contrib postgis
   
   # For Windows
   # Download and install PostgreSQL with PostGIS from https://postgis.net/windows_downloads/
   ```

2. Create the database and enable PostGIS:
   ```sql
   CREATE DATABASE Taxi24DB;
   CREATE EXTENSION postgis;
   ```

3. Run the database migrations:
   ```bash
   npm run migration:run
   ```

## Project Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure environment variables:
   Create a `.env` file in the root directory with the following variables:
   ```
   DATABASE_HOST=localhost
   DATABASE_PORT=5432
   DATABASE_USERNAME=your_username
   DATABASE_PASSWORD=your_password
   DATABASE_NAME=Taxi24DB
   ```

## Available Scripts

- `npm run start` - Start the application
- `npm run start:dev` - Start the application in development mode with hot-reload
- `npm run start:debug` - Start the application in debug mode
- `npm run start:prod` - Start the application in production mode
- `npm run build` - Build the application
- `npm run format` - Format the code using Prettier
- `npm run lint` - Lint the code using ESLint

### Database Scripts

- `npm run migration:generate` - Generate a new migration
- `npm run migration:run` - Run pending migrations
- `npm run migration:revert` - Revert the last migration
- `npm run migration:create` - Create a new empty migration
- `npm run seed` - Seed the database with initial data

### Testing Scripts

- `npm run test` - Run unit tests
- `npm run test:watch` - Run unit tests in watch mode
- `npm run test:cov` - Run unit tests with coverage
- `npm run test:debug` - Run unit tests in debug mode
- `npm run test:e2e` - Run end-to-end tests

## Database Schema

The system includes the following main entities:

- **Driver**: Manages driver information and location
- **Passenger**: Stores passenger details
- **Trip**: Tracks trip information with geospatial data
- **Invoice**: Handles trip billing and payment information

## Author

- [Julio Hernandez](https://github.com/JulioJosueG)

## License

This project is UNLICENSED.
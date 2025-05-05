CREATE DATABASE Taxi24DB

CREATE EXTENSION postgis;


CREATE TYPE "public"."trip_tripstatus_enum" AS ENUM('active', 'complete')

CREATE TABLE "trip" ("id" SERIAL NOT NULL, "passengerId" integer NOT NULL, "driverId" integer NOT NULL, "startingPoint" geometry(Point,4326) NOT NULL, "endPoint" geometry(Point,4326) NOT NULL, "tripStatus" "public"."trip_tripstatus_enum" NOT NULL DEFAULT 'active', CONSTRAINT "PK_714c23d558208081dbccb9d9268" PRIMARY KEY ("id"))

CREATE TABLE "driver" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "telephone" character varying NOT NULL, "dni" character varying NOT NULL, "isAvailable" boolean NOT NULL DEFAULT true, "location" geometry(Point,4326) NOT NULL, CONSTRAINT "PK_61de71a8d217d585ecd5ee3d065" PRIMARY KEY ("id"))

CREATE TABLE "passenger" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, CONSTRAINT "PK_50e940dd2c126adc20205e83fac" PRIMARY KEY ("id"))


CREATE INDEX idx_driver_location ON driver USING GIST (location);
CREATE INDEX idx_trip_starting_point ON trip USING GIST (starting_point);
CREATE INDEX idx_trip_end_point ON trip USING GIST (end_point);
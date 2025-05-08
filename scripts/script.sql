CREATE DATABASE Taxi24DB

CREATE EXTENSION postgis;


CREATE TYPE "public"."trip_tripstatus_enum" AS ENUM('active', 'complete')

CREATE TABLE "trip" ("id" SERIAL NOT NULL, "passengerId" integer NOT NULL, "driverId" integer NOT NULL, "startingPoint" geometry(Point,4326) NOT NULL, "endPoint" geometry(Point,4326) NOT NULL, "tripStatus" "public"."trip_tripstatus_enum" NOT NULL DEFAULT 'active', CONSTRAINT "PK_714c23d558208081dbccb9d9268" PRIMARY KEY ("id"))

CREATE TABLE "driver" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "telephone" character varying NOT NULL, "dni" character varying NOT NULL, "isAvailable" boolean NOT NULL DEFAULT true, "location" geometry(Point,4326) NOT NULL, CONSTRAINT "PK_61de71a8d217d585ecd5ee3d065" PRIMARY KEY ("id"))

CREATE TABLE "passenger" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, CONSTRAINT "PK_50e940dd2c126adc20205e83fac" PRIMARY KEY ("id"))

CREATE TABLE "invoice" (
    "id" SERIAL NOT NULL,
    "tripId" integer NOT NULL,
    "distance" decimal(10,2) NOT NULL,
    "baseCost" decimal(10,2) NOT NULL,
    "tax" decimal(10,2) NOT NULL,
    "subtotal" decimal(10,2) NOT NULL,
    "total" decimal(10,2) NOT NULL,
    "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
    CONSTRAINT "PK_invoice" PRIMARY KEY ("id"),
    CONSTRAINT "FK_invoice_trip" FOREIGN KEY ("tripId") REFERENCES "trip"("id")
);


-- Sample data for completed trips with invoices
INSERT INTO "passenger" ("name") VALUES 
('John Doe'),
('Jane Smith');

INSERT INTO "driver" ("name", "telephone", "dni", "isAvailable", "location") VALUES 
('Mike Johnson', '1234567890', 'DNI123', false, ST_SetSRID(ST_MakePoint(-74.006, 40.7128), 4326)),
('Sarah Williams', '0987654321', 'DNI456', false, ST_SetSRID(ST_MakePoint(-73.935242, 40.730610), 4326));

INSERT INTO "trip" ("passengerId", "driverId", "startingPoint", "endPoint", "tripStatus") VALUES 
(1, 1, ST_SetSRID(ST_MakePoint(-74.006, 40.7128), 4326), ST_SetSRID(ST_MakePoint(-73.935242, 40.730610), 4326), 'complete'),
(2, 2, ST_SetSRID(ST_MakePoint(-73.935242, 40.730610), 4326), ST_SetSRID(ST_MakePoint(-74.006, 40.7128), 4326), 'complete');

-- Insert sample invoices for completed trips
INSERT INTO "invoice" ("tripId", "distance", "baseCost", "tax", "subtotal", "total") VALUES 
(1, 5.2, 10.40, 1.04, 10.40, 11.44),
(2, 5.2, 10.40, 1.04, 10.40, 11.44);
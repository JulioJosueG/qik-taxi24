import { MigrationInterface, QueryRunner } from 'typeorm';

export class Taxi24DB1746431098614 implements MigrationInterface {
  name = 'Taxi24DB1746431098614';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."trip_tripstatus_enum" AS ENUM('active', 'complete')`,
    );
    await queryRunner.query(
      `CREATE TABLE "trip" ("id" SERIAL NOT NULL, "passengerId" integer NOT NULL, "driverId" integer NOT NULL, "startingPoint" geometry(Point,4326) NOT NULL, "endPoint" geometry(Point,4326) NOT NULL, "tripStatus" "public"."trip_tripstatus_enum" NOT NULL DEFAULT 'active', CONSTRAINT "PK_714c23d558208081dbccb9d9268" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "driver" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "telephone" character varying NOT NULL, "dni" character varying NOT NULL, "isAvailable" boolean NOT NULL DEFAULT true, "location" geometry(Point,4326) NOT NULL, CONSTRAINT "PK_61de71a8d217d585ecd5ee3d065" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "passenger" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, CONSTRAINT "PK_50e940dd2c126adc20205e83fac" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "passenger"`);
    await queryRunner.query(`DROP TABLE "driver"`);
    await queryRunner.query(`DROP TABLE "trip"`);
    await queryRunner.query(`DROP TYPE "public"."trip_tripstatus_enum"`);
  }
}

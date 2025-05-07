import { MigrationInterface, QueryRunner } from 'typeorm';

export class Taxi24DB1746642987125 implements MigrationInterface {
  name = 'Taxi24DB1746642987125';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "invoice" ("id" SERIAL NOT NULL, "tripId" integer NOT NULL, "distance" numeric(10,2) NOT NULL, "baseCost" numeric(10,2) NOT NULL, "tax" numeric(10,2) NOT NULL, "subtotal" numeric(10,2) NOT NULL, "total" numeric(10,2) NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_15d25c200d9bcd8a33f698daf18" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "invoice"`);
  }
}

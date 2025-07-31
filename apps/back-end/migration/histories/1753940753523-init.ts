import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1753940753523 implements MigrationInterface {
  name = "Init1753940753523";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "username" character varying NOT NULL, "password" character varying NOT NULL DEFAULT '', CONSTRAINT "user_id_primary_key" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "user_username_unique" ON "user" ("username") `,
    );
    await queryRunner.query(
      `CREATE TABLE "auth" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "token" character varying NOT NULL, "refresh_token" character varying NOT NULL, "expires_at" TIMESTAMP WITH TIME ZONE NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "user_id" uuid, CONSTRAINT "auth_id_primary_key" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "auth" ADD CONSTRAINT "auth_user_id_foreign_key" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "auth" DROP CONSTRAINT "auth_user_id_foreign_key"`,
    );
    await queryRunner.query(`DROP TABLE "auth"`);
    await queryRunner.query(`DROP INDEX "public"."user_username_unique"`);
    await queryRunner.query(`DROP TABLE "user"`);
  }
}

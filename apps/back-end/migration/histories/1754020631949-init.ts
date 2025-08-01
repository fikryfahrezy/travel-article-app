import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1754020631949 implements MigrationInterface {
  name = "Init1754020631949";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "username" character varying(50) NOT NULL, "password" character varying(255) NOT NULL DEFAULT '', "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "users_id_primary_key" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "users_username_unique" ON "users" ("username") `,
    );
    await queryRunner.query(
      `CREATE TABLE "auths" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "token" character varying(255) NOT NULL, "refresh_token" character varying(255) NOT NULL, "expires_at" TIMESTAMP WITH TIME ZONE NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "user_id" uuid NOT NULL, CONSTRAINT "auths_id_primary_key" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "articles" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying(100) NOT NULL, "slug" character varying(100) NOT NULL, "content" text NOT NULL DEFAULT '', "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "author_id" uuid NOT NULL, CONSTRAINT "articles_id_primary_key" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "articles_slug_unique" ON "articles" ("slug") `,
    );
    await queryRunner.query(
      `CREATE TABLE "article_comments" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "content" text NOT NULL DEFAULT '', "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "article_id" uuid NOT NULL, "author_id" uuid NOT NULL, CONSTRAINT "article_comments_id_primary_key" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "article_likes" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "article_id" uuid NOT NULL, "user_id" uuid NOT NULL, CONSTRAINT "article_likes_id_primary_key" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "article_likes_articles_users_unique" ON "article_likes" ("article_id", "user_id") `,
    );
    await queryRunner.query(
      `ALTER TABLE "auths" ADD CONSTRAINT "auths_users_id_foreign_key" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "articles" ADD CONSTRAINT "articles_users_id_foreign_key" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "article_comments" ADD CONSTRAINT "article_comments_articles_id_foreign_key" FOREIGN KEY ("article_id") REFERENCES "articles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "article_comments" ADD CONSTRAINT "article_comments_users_id_foreign_key" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "article_likes" ADD CONSTRAINT "article_likes_articles_id_foreign_key" FOREIGN KEY ("article_id") REFERENCES "articles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "article_likes" ADD CONSTRAINT "article_likes_users_id_foreign_key" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "article_likes" DROP CONSTRAINT "article_likes_users_id_foreign_key"`,
    );
    await queryRunner.query(
      `ALTER TABLE "article_likes" DROP CONSTRAINT "article_likes_articles_id_foreign_key"`,
    );
    await queryRunner.query(
      `ALTER TABLE "article_comments" DROP CONSTRAINT "article_comments_users_id_foreign_key"`,
    );
    await queryRunner.query(
      `ALTER TABLE "article_comments" DROP CONSTRAINT "article_comments_articles_id_foreign_key"`,
    );
    await queryRunner.query(
      `ALTER TABLE "articles" DROP CONSTRAINT "articles_users_id_foreign_key"`,
    );
    await queryRunner.query(
      `ALTER TABLE "auths" DROP CONSTRAINT "auths_users_id_foreign_key"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."article_likes_articles_users_unique"`,
    );
    await queryRunner.query(`DROP TABLE "article_likes"`);
    await queryRunner.query(`DROP TABLE "article_comments"`);
    await queryRunner.query(`DROP INDEX "public"."articles_slug_unique"`);
    await queryRunner.query(`DROP TABLE "articles"`);
    await queryRunner.query(`DROP TABLE "auths"`);
    await queryRunner.query(`DROP INDEX "public"."users_username_unique"`);
    await queryRunner.query(`DROP TABLE "users"`);
  }
}

import { DataSource } from "typeorm";

export default new DataSource({
  type: "postgres",
  host: process.env.DATABASE_HOST,
  port: Number(process.env.DATABASE_PORT),
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_DBNAME,
  entities: [__dirname + "/../src/entities/*.entity{.ts,.js}"],
  migrations: [__dirname + "/histories/**/*.{ts,js}"],
  migrationsTableName: "migrations",
});

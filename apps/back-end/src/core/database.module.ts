import { DynamicModule } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { EnvService } from "src/config/env.service";

export class DatabaseModule {
  static register(): DynamicModule {
    return TypeOrmModule.forRootAsync({
      inject: [EnvService],
      useFactory: (envService: EnvService) => {
        return {
          type: "postgres",
          host: envService.key.DATABASE_HOST,
          port: envService.key.DATABASE_PORT,
          username: envService.key.DATABASE_USERNAME,
          password: envService.key.DATABASE_PASSWORD,
          database: envService.key.DATABASE_DBNAME,
          entities: [__dirname + "/../entities/*.entity{.ts,.js}"],
        };
      },
    });
  }
}

import { Injectable } from "@nestjs/common";
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from "@nestjs/typeorm";
import { EnvService } from "src/config/env.service";

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor(private envService: EnvService) {}
  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: "postgres",
      host: this.envService.key.DATABASE_HOST,
      port: this.envService.key.DATABASE_PORT,
      username: this.envService.key.DATABASE_USERNAME,
      password: this.envService.key.DATABASE_PASSWORD,
      database: this.envService.key.DATABASE_DBNAME,
      entities: [__dirname + "/../entities/*.entity{.ts,.js}"],
    };
  }
}

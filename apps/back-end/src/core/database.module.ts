import { DynamicModule } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigService } from "src/config/config.service";

export class DatabaseModule {
  static register(): DynamicModule {
    return TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          type: "postgres",
          host: configService.env.DATABASE_HOST,
          port: configService.env.DATABASE_PORT,
          username: configService.env.DATABASE_USERNAME,
          password: configService.env.DATABASE_PASSWORD,
          database: configService.env.DATABASE_DBNAME,
          entities: [__dirname + "/../entities/*.entity{.ts,.js}"],
        };
      },
    });
  }
}

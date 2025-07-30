import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthModule } from "./auth/auth.module";
import { validateEnv } from "./config/env";
import { EnvModule } from "./config/env.module";
import { HealthModule } from "./health/health.module";
import { TypeOrmConfigService } from "./lib/typeorm-service";
import { UsersModule } from "./users/users.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [".env", ".env.development.local", ".env.development"],
      validate: validateEnv,
    }),
    EnvModule,
    TypeOrmModule.forRootAsync({
      imports: [],
      useClass: TypeOrmConfigService,
    }),
    AuthModule,
    UsersModule,
    HealthModule,
  ],
})
export class AppModule {}

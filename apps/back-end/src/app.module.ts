import { Module } from "@nestjs/common";
import { ConfigModule as NestConfigModule } from "@nestjs/config";
import { AuthModule } from "./auth/auth.module";
import { ConfiModule } from "./config/config.module";
import { validateEnv } from "./config/env";
import { CoreModule } from "./core/core.module";
import { DatabaseModule } from "./core/database.module";
import { JwtModule } from "./core/jwt.module";
import { HealthModule } from "./health/health.module";
import { UsersModule } from "./users/users.module";

@Module({
  imports: [
    NestConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [".env", ".env.development.local", ".env.development"],
      validate: validateEnv,
    }),
    ConfiModule,
    JwtModule.register(),
    DatabaseModule.register(),
    CoreModule,
    HealthModule,
    UsersModule,
    AuthModule,
  ],
})
export class AppModule {}

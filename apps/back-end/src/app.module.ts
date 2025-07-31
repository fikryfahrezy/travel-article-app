import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AuthModule } from "./auth/auth.module";
import { validateEnv } from "./config/env";
import { EnvModule } from "./config/env.module";
import { CoreModule } from "./core/core.module";
import { DatabaseModule } from "./core/database.module";
import { JwtModule } from "./core/jwt.module";
import { HealthModule } from "./health/health.module";
import { UsersModule } from "./users/users.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [".env", ".env.development.local", ".env.development"],
      validate: validateEnv,
    }),
    EnvModule,
    JwtModule.register(),
    DatabaseModule.register(),
    CoreModule,
    HealthModule,
    UsersModule,
    AuthModule,
  ],
})
export class AppModule {}

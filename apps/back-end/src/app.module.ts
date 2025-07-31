import { Module } from "@nestjs/common";
import { ConfigModule as NestConfigModule } from "@nestjs/config";
import { ArticleModule } from "./article/article.module";
import { AuthModule } from "./auth/auth.module";
import { ConfigModule } from "./config/config.module";
import { validateEnv } from "./config/env";
import { CoreModule } from "./core/core.module";
import { DatabaseModule } from "./core/database.module";
import { JwtModule } from "./core/jwt.module";
import { HealthModule } from "./health/health.module";

@Module({
  imports: [
    NestConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [".env", ".env.development.local", ".env.development"],
      validate: validateEnv,
    }),
    ConfigModule,
    JwtModule.register(),
    DatabaseModule.register(),
    CoreModule,
    HealthModule,
    AuthModule,
    ArticleModule,
  ],
})
export class AppModule {}

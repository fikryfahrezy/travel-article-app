import { DynamicModule } from "@nestjs/common";
import { JwtModule as NestJwtModule } from "@nestjs/jwt";
import { EnvService } from "src/config/env.service";

export class JwtModule {
  static register(): DynamicModule {
    return NestJwtModule.registerAsync({
      inject: [EnvService],
      global: true,
      useFactory: (envService: EnvService) => {
        return {
          secret: envService.key.JWT_SECRET,
          signOptions: { expiresIn: "60s" },
        };
      },
    });
  }
}

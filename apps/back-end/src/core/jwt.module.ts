import { DynamicModule } from "@nestjs/common";
import { JwtModule as NestJwtModule } from "@nestjs/jwt";
import { ConfigService } from "src/config/config.service";

export class JwtModule {
  static register(): DynamicModule {
    return NestJwtModule.registerAsync({
      inject: [ConfigService],
      global: true,
      useFactory: () => {
        return {};
      },
    });
  }
}

import { Injectable } from "@nestjs/common";
import { ConfigService as NestConfigService } from "@nestjs/config";
import { EnvironmentVariables } from "./env";

@Injectable()
export class ConfigService {
  static = {
    // Make the access token valid until 5 minutes in seconds
    ACCESS_TOKEN_EXPIRES_AT: 5 * 60,
    ACCESS_TOKEN_COOKIE_KEY: "access_token",
    // Make the refresh token valid until 30 days in seconds
    REFRESH_TOKEN_EXPIRES_AT: 30 * 24 * 60 * 60,
    REFRESH_TOKEN_COOKIE_KEY: "refresh_token",
  };
  env: EnvironmentVariables["env"];

  constructor(configService: NestConfigService<EnvironmentVariables>) {
    this.env = configService.get("env", { infer: true })!;
  }
}

import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { EnvironmentVariables } from "./env";

@Injectable()
export class EnvService {
  key: EnvironmentVariables["env"];
  constructor(configService: ConfigService<EnvironmentVariables>) {
    this.key = configService.get("env", { infer: true })!;
  }
}

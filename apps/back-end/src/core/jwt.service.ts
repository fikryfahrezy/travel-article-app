import { Injectable } from "@nestjs/common";
import { JwtService as NestJwtService } from "@nestjs/jwt";
import { EnvService } from "src/config/env.service";

export type JwtPayload = {
  sub: string;
};

@Injectable()
export class JwtService {
  constructor(
    private envService: EnvService,
    private jwtService: NestJwtService,
  ) {}

  async verify(token: string): Promise<JwtPayload> {
    return await this.jwtService.verifyAsync(token, {
      secret: this.envService.key.JWT_SECRET,
    });
  }

  async sign(payload: JwtPayload) {
    return await this.jwtService.signAsync(payload);
  }
}

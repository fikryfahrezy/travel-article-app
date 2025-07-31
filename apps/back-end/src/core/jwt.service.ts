import { Injectable } from "@nestjs/common";
import { JwtSignOptions, JwtService as NestJwtService } from "@nestjs/jwt";
import { ConfigService } from "src/config/config.service";

export type JwtPayload = {
  sub: string;
};

@Injectable()
export class JwtService {
  constructor(
    private configService: ConfigService,
    private jwtService: NestJwtService,
  ) {}

  async verify(token: string): Promise<JwtPayload> {
    return await this.jwtService.verifyAsync(token, {
      secret: this.configService.env.JWT_SECRET,
      issuer: this.configService.env.JWT_ISSUER,
    });
  }

  async sign(payload: JwtPayload, options?: Pick<JwtSignOptions, "expiresIn">) {
    return await this.jwtService.signAsync(
      { ...payload, iat: Math.floor(Date.now() / 1000) },
      {
        ...options,
        secret: this.configService.env.JWT_SECRET,
        issuer: this.configService.env.JWT_ISSUER,
      },
    );
  }
}

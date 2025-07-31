import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { Request } from "express";
import { ConfigService } from "src/config/config.service";
import { JwtService } from "src/core/jwt.service";

@Injectable()
export class JwtGuard implements CanActivate {
  constructor(
    private configService: ConfigService,
    private jwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeaderOrCookie(request);
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const payload = await this.jwtService.verify(token);
      (request as unknown as Record<string, unknown>)["jwt"] = payload;
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractTokenFromHeaderOrCookie(request: Request): string | undefined {
    const reqCookies = request.cookies as unknown as Record<string, unknown>;
    const tokenCookie = reqCookies[
      this.configService.static.ACCESS_TOKEN_COOKIE_KEY
    ] as string;

    if (tokenCookie) {
      return tokenCookie;
    }
    const [type, token] = request.headers.authorization?.split(" ") ?? [];
    return type === "Bearer" ? token : undefined;
  }
}

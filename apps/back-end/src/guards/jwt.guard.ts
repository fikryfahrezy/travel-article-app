import {
  CanActivate,
  ExecutionContext,
  Inject,
  mixin,
  Type,
  UnauthorizedException,
} from "@nestjs/common";
import { Request } from "express";
import { ConfigService } from "src/config/config.service";
import { JwtService } from "src/core/jwt.service";

export function extractJwtTokenFromCookie(
  request: Request,
  cookieKey: string,
): string | undefined {
  const reqCookies = request.cookies as unknown as Record<string, unknown>;
  return reqCookies[cookieKey] as string;
}

export function extractJwtTokenFromHeaderOrCookie(
  request: Request,
  cookieKey: string,
): string | undefined {
  const tokenCookie = extractJwtTokenFromCookie(request, cookieKey);
  if (tokenCookie) {
    return tokenCookie;
  }
  const [type, token] = request.headers.authorization?.split(" ") ?? [];
  return type === "Bearer" ? token : undefined;
}

export function JwtGuard(force = true): Type<CanActivate> {
  class JwtAuthGuard implements CanActivate {
    constructor(
      @Inject(ConfigService) private configService: ConfigService,
      @Inject(JwtService) private jwtService: JwtService,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
      const request: Request = context.switchToHttp().getRequest();
      const token = extractJwtTokenFromHeaderOrCookie(
        request,
        this.configService.static.ACCESS_TOKEN_COOKIE_KEY,
      );

      // For some API that accept need auth or don't need at the same time like list of article
      // API accessible publicly but there are some fields that missing
      if (!token && !force) {
        return true;
      }

      if (!token) {
        throw new UnauthorizedException();
      }
      try {
        const payload = await this.jwtService.verify(token);
        (request as unknown as Record<string, unknown>)["jwt"] = payload;
        (request as unknown as Record<string, unknown>)["jwt_token"] = token;
      } catch {
        if (force) {
          throw new UnauthorizedException();
        }
      }
      return true;
    }
  }

  return mixin(JwtAuthGuard);
}

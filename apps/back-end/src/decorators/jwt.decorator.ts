import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { Request } from "express";
import { JwtPayload } from "src/core/jwt.service";

export const Jwt = createParamDecorator((_: unknown, ctx: ExecutionContext) => {
  const request: Request = ctx.switchToHttp().getRequest();
  const jwt = (request as unknown as Record<string, unknown>)["jwt"];
  return jwt as JwtPayload;
});

export const JwtToken = createParamDecorator(
  (_: unknown, ctx: ExecutionContext) => {
    const request: Request = ctx.switchToHttp().getRequest();
    const jwt = (request as unknown as Record<string, unknown>)["jwt_token"];
    return jwt as string;
  },
);

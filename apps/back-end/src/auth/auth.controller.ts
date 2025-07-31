import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { Request, Response } from "express";
import { ConfigService } from "src/config/config.service";
import { JwtPayload } from "src/core/jwt.service";
import { Jwt } from "src/decorators/jwt.decorator";
import { extractJwtTokenFromCookie, JwtAuthGuard } from "src/guards/jwt.guard";
import {
  AuthResDto,
  LoginReqDto,
  LogoutResDto,
  ProfileResDto,
  RefreshReqDto,
  RegisterReqDto,
} from "./auth.dto";
import {
  AuthNotFoundError,
  DuplicateUsernameError,
  InvalidTokenError,
  PasswordNotMatchError,
  RefreshTokenExpiredError,
  UnhandledError,
  UserNotFoundError,
} from "./auth.exception";
import { AuthService } from "./auth.service";

@Controller("auth")
export class AuthController {
  constructor(
    private configService: ConfigService,
    private authService: AuthService,
  ) {}

  setCookie(response: Response, authResDto: AuthResDto) {
    response.cookie(
      this.configService.static.ACCESS_TOKEN_COOKIE_KEY,
      authResDto.accessToken,
      {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        maxAge: this.configService.static.ACCESS_TOKEN_EXPIRES_AT * 1000, // convert seconds to milliseconds
        domain: this.configService.env.TOKEN_COOKIE_DOMAIN,
        path: "/",
      },
    );

    response.cookie(
      this.configService.static.REFRESH_TOKEN_COOKIE_KEY,
      authResDto.refreshToken,
      {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        maxAge: this.configService.static.REFRESH_TOKEN_EXPIRES_AT * 1000, // convert seconds to milliseconds
        domain: this.configService.env.TOKEN_COOKIE_DOMAIN,
        path: "/",
      },
    );
  }

  clearCookie(response: Response) {
    response.cookie(this.configService.static.ACCESS_TOKEN_COOKIE_KEY, "", {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: 0,
      domain: this.configService.env.TOKEN_COOKIE_DOMAIN,
      path: "/",
    });

    response.cookie(this.configService.static.REFRESH_TOKEN_COOKIE_KEY, "", {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: 0,
      domain: this.configService.env.TOKEN_COOKIE_DOMAIN,
      path: "/",
    });
  }

  @Post("register")
  @HttpCode(201)
  @ApiOperation({ summary: "Register user account" })
  @ApiResponse({ status: 200, type: AuthResDto })
  @ApiResponse({ status: 500, type: UnhandledError })
  async register(
    @Body() registerReqDto: RegisterReqDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const result = await this.authService.register(registerReqDto);
    this.setCookie(response, result);
    return result;
  }

  @Post("login")
  @HttpCode(200)
  @ApiOperation({ summary: "Login to user account" })
  @ApiResponse({ status: 200, type: AuthResDto })
  @ApiResponse({ status: 400, type: PasswordNotMatchError })
  @ApiResponse({ status: 422, type: DuplicateUsernameError })
  @ApiResponse({ status: 404, type: UserNotFoundError })
  @ApiResponse({ status: 500, type: UnhandledError })
  async login(
    @Body() loginReqDto: LoginReqDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const result = await this.authService.login(loginReqDto);
    this.setCookie(response, result);
    return result;
  }

  @Post("refresh")
  @HttpCode(200)
  @ApiOperation({ summary: "Refresh expire access token" })
  @ApiResponse({ status: 200, type: AuthResDto })
  @ApiResponse({ status: 400, type: InvalidTokenError })
  @ApiResponse({ status: 422, type: RefreshTokenExpiredError })
  @ApiResponse({ status: 500, type: UnhandledError })
  async refresh(
    @Body() refreshReqDto: RefreshReqDto,
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const _refreshToken = extractJwtTokenFromCookie(
      request,
      this.configService.static.REFRESH_TOKEN_COOKIE_KEY,
    );

    const refreshToken = _refreshToken || refreshReqDto.refreshToken;
    if (!refreshToken) {
      throw new InvalidTokenError();
    }

    const result = await this.authService.refresh({
      refreshToken: refreshToken,
    });
    this.setCookie(response, result);

    return result;
  }

  @Post("logout")
  @HttpCode(200)
  @ApiBearerAuth()
  @ApiOperation({ summary: "For user to logout" })
  @ApiResponse({ status: 200, type: LogoutResDto })
  @ApiResponse({ status: 401, type: UnauthorizedException })
  @ApiResponse({ status: 404, type: AuthNotFoundError })
  @ApiResponse({ status: 500, type: UnhandledError })
  @UseGuards(JwtAuthGuard)
  async logout(
    @Jwt() jwt: JwtPayload,
    @Res({ passthrough: true }) response: Response,
  ) {
    const result = await this.authService.logout({
      userId: jwt.sub,
    });
    this.clearCookie(response);
    return result;
  }

  @Get("profile")
  @HttpCode(200)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get user profile" })
  @ApiResponse({ status: 200, type: ProfileResDto })
  @ApiResponse({ status: 401, type: UnauthorizedException })
  @ApiResponse({ status: 404, type: UserNotFoundError })
  @ApiResponse({ status: 500, type: UnhandledError })
  @UseGuards(JwtAuthGuard)
  async profile(@Jwt() jwt: JwtPayload) {
    const result = await this.authService.profile({
      userId: jwt.sub,
    });
    return result;
  }
}

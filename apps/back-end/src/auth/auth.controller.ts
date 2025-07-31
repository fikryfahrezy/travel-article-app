import { Body, Controller, HttpCode, Post, UsePipes } from "@nestjs/common";
import { ApiOperation, ApiResponse } from "@nestjs/swagger";
import { ZodValidationPipe } from "src/pipes/zod-valition-pipe";
import {
  AuthResDto,
  LoginReqDto,
  LoginReqSchema,
  LogoutResDto,
  RefreshReqDto,
  RefreshReqSchema,
  RegisterReqDto,
  RegisterReqSchema,
} from "./auth.dto";
import {
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
  constructor(private authService: AuthService) {}

  @Post("register")
  @HttpCode(201)
  @ApiOperation({ summary: "Register user account" })
  @ApiResponse({ status: 200, type: AuthResDto })
  @ApiResponse({ status: 500, type: UnhandledError })
  @UsePipes(new ZodValidationPipe(RegisterReqSchema))
  register(@Body() registerReqDto: RegisterReqDto) {
    return this.authService.register(registerReqDto);
  }

  @Post("login")
  @HttpCode(200)
  @ApiOperation({ summary: "Login to user account" })
  @ApiResponse({ status: 200, type: AuthResDto })
  @ApiResponse({ status: 400, type: PasswordNotMatchError })
  @ApiResponse({ status: 422, type: DuplicateUsernameError })
  @ApiResponse({ status: 404, type: UserNotFoundError })
  @ApiResponse({ status: 500, type: UnhandledError })
  @UsePipes(new ZodValidationPipe(LoginReqSchema))
  login(@Body() loginReqDto: LoginReqDto) {
    return this.authService.login(loginReqDto);
  }

  @Post("refresh")
  @HttpCode(200)
  @ApiOperation({ summary: "Refresh expire access token" })
  @ApiResponse({ status: 200, type: AuthResDto })
  @ApiResponse({ status: 400, type: InvalidTokenError })
  @ApiResponse({ status: 422, type: RefreshTokenExpiredError })
  @ApiResponse({ status: 500, type: UnhandledError })
  @UsePipes(new ZodValidationPipe(RefreshReqSchema))
  refresh(@Body() refreshReqDto: RefreshReqDto) {
    return this.authService.refresh(refreshReqDto);
  }

  @Post("logout")
  @HttpCode(200)
  @ApiOperation({ summary: "For user to logout" })
  @ApiResponse({ status: 200, type: LogoutResDto })
  logout() {
    return this.authService.logout({
      userId: "78e7d49d-f0fa-4fea-8af4-45c87bfb90c6",
    });
  }
}

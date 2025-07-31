import { Injectable } from "@nestjs/common";
import { ConfigService } from "src/config/config.service";
import { JwtService } from "src/core/jwt.service";
import { passwordHash, passwordVerify } from "src/lib/password";
import { generateOpaqueToken } from "src/lib/token";
import {
  AuthResDto,
  LoginReqDto,
  LogoutReqDto,
  LogoutResDto,
  ProfileReqDto,
  ProfileResDto,
  RefreshReqDto,
  RegisterReqDto,
} from "./auth.dto";
import {
  AuthNotFoundError,
  InvalidTokenError,
  PasswordNotMatchError,
  RefreshTokenExpiredError,
  UserNotFoundError,
} from "./auth.exception";
import { AuthRepository } from "./auth.repository";

type GenerateRefreshTokenParams =
  | {
      mode: "new";
      userId: string;
      accessToken: string;
    }
  | {
      mode: "update";
      prevAuthId: string;
      userId: string;
      accessToken: string;
    };

@Injectable()
export class AuthService {
  constructor(
    private configService: ConfigService,
    private jwtService: JwtService,
    private authRepository: AuthRepository,
  ) {}

  async generateRefreshToken(params: GenerateRefreshTokenParams) {
    const refreshToken = generateOpaqueToken();

    // Add 30 days in milliseconds
    const expiresAt = new Date(
      Date.now() + this.configService.static.REFRESH_TOKEN_EXPIRES_AT * 1000,
    );

    if (params.mode === "new") {
      await this.authRepository.saveAuth({
        token: params.accessToken,
        refreshToken: refreshToken,
        expiresAt,
        user: {
          id: params.userId,
        },
      });
    } else {
      await this.authRepository.updateAuth({
        id: params.prevAuthId,
        token: params.accessToken,
        refreshToken: refreshToken,
        expiresAt,
        user: {
          id: params.userId,
        },
      });
    }

    return refreshToken;
  }
  async register(registerReqDto: RegisterReqDto): Promise<AuthResDto> {
    const newUser = await this.authRepository.saveUser({
      password: await passwordHash(registerReqDto.password),
      username: registerReqDto.username,
    });

    const accessToken = await this.jwtService.sign(
      {
        sub: newUser.id,
      },
      {
        expiresIn: this.configService.static.ACCESS_TOKEN_EXPIRES_AT,
      },
    );
    const refreshToken = await this.generateRefreshToken({
      mode: "new",
      userId: newUser.id,
      accessToken: accessToken,
    });

    return new AuthResDto({
      tokenType: "Bearer",
      expiresIn: this.configService.static.ACCESS_TOKEN_EXPIRES_AT,
      accessToken: accessToken,
      refreshToken: refreshToken,
    });
  }

  async login(loginReqDto: LoginReqDto): Promise<AuthResDto> {
    const user = await this.authRepository.getOneUser({
      username: loginReqDto.username,
    });

    if (!user) {
      throw new UserNotFoundError(
        `User with ${loginReqDto.username} not found`,
      );
    }

    const isPasswordMatch = await passwordVerify(
      user.password,
      loginReqDto.password,
    );

    if (!isPasswordMatch) {
      throw new PasswordNotMatchError("Password not match.");
    }

    const accessToken = await this.jwtService.sign(
      {
        sub: user.id,
      },
      {
        expiresIn: this.configService.static.ACCESS_TOKEN_EXPIRES_AT,
      },
    );
    const refreshToken = await this.generateRefreshToken({
      mode: "new",
      userId: user.id,
      accessToken: accessToken,
    });

    return new AuthResDto({
      tokenType: "Bearer",
      expiresIn: this.configService.static.ACCESS_TOKEN_EXPIRES_AT,
      accessToken: accessToken,
      refreshToken: refreshToken,
    });
  }

  async refresh(refreshReqDto: RefreshReqDto): Promise<AuthResDto> {
    const auth = await this.authRepository.getOneAuth({
      refreshToken: refreshReqDto.refreshToken,
    });

    if (!auth) {
      throw new InvalidTokenError("Either token or refresh token is invalid");
    }

    if (auth.expiresAt.getTime() < new Date().getTime()) {
      throw new RefreshTokenExpiredError("Refresh token is expired.");
    }

    const accessToken = await this.jwtService.sign(
      {
        sub: auth.user.id,
      },
      {
        expiresIn: this.configService.static.ACCESS_TOKEN_EXPIRES_AT,
      },
    );
    const refreshToken = await this.generateRefreshToken({
      mode: "update",
      prevAuthId: auth.id,
      userId: auth.user.id,
      accessToken: accessToken,
    });

    return new AuthResDto({
      tokenType: "Bearer",
      accessToken: accessToken,
      expiresIn: this.configService.static.ACCESS_TOKEN_EXPIRES_AT,
      refreshToken: refreshToken,
    });
  }

  async logout(logoutReqDto: LogoutReqDto) {
    const auth = await this.authRepository.getOneAuth({
      user: {
        id: logoutReqDto.userId,
      },
    });

    if (!auth) {
      throw new AuthNotFoundError("User not logged in.");
    }

    await this.authRepository.deleteAuth({
      id: auth.id,
      user: {
        id: auth.user.id,
      },
    });

    return new LogoutResDto({
      success: true,
    });
  }

  async profile(profileReqDto: ProfileReqDto): Promise<ProfileResDto> {
    const user = await this.authRepository.getOneUser({
      id: profileReqDto.userId,
    });

    if (!user) {
      throw new UserNotFoundError("User with profile not found");
    }

    return new ProfileResDto({
      userId: user.id,
      username: user.username,
    });
  }
}

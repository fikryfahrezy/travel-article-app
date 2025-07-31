import { Injectable } from "@nestjs/common";
import { JwtService } from "src/core/jwt.service";
import { Auth } from "src/entities/auth.entity";
import { User } from "src/entities/user.entity";
import { passwordHash, passwordVerify } from "src/lib/password";
import { generateOpaqueToken } from "src/lib/token";
import {
  AuthResDto,
  LoginReqDto,
  LogoutReqDto,
  LogoutResDto,
  RefreshReqDto,
  RegisterReqDto,
} from "./auth.dto";
import {
  AuthNotFoundError,
  InvalidTokenError,
  PasswordNotMatchError,
  RefreshTokenExpiredError,
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
  // Make the refresh token valid until 30 days in seconds
  expiresAt = 30 * 24 * 60 * 60;

  constructor(
    private jwtService: JwtService,
    private authRepository: AuthRepository,
  ) {}

  async generateRefreshToken(params: GenerateRefreshTokenParams) {
    const refreshToken = generateOpaqueToken();

    const userRelation = new User();
    userRelation.id = params.userId;

    const authValue: Partial<Auth> = {
      token: params.accessToken,
      refreshToken: refreshToken,
      // Add 30 days in milliseconds
      expiresAt: new Date(Date.now() + this.expiresAt * 1000),
      user: userRelation,
    };

    if (params.mode === "new") {
      await this.authRepository.createAuth(authValue);
    } else {
      await this.authRepository.updateAuth({
        ...authValue,
        id: params.prevAuthId,
      });
    }

    return refreshToken;
  }
  async register(registerReqDto: RegisterReqDto): Promise<AuthResDto> {
    const newUser = await this.authRepository.insertUser({
      password: await passwordHash(registerReqDto.password),
      username: registerReqDto.username,
    });

    const accessToken = await this.jwtService.sign({
      sub: newUser.id,
    });
    const refreshToken = await this.generateRefreshToken({
      mode: "new",
      userId: newUser.id,
      accessToken: accessToken,
    });

    return {
      token_type: "Bearer",
      expires_in: this.expiresAt,
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  async login(loginReqDto: LoginReqDto): Promise<AuthResDto> {
    const user = await this.authRepository.getOneUser({
      username: loginReqDto.username,
    });

    const isPasswordMatch = await passwordVerify(
      user.password,
      loginReqDto.password,
    );

    if (!isPasswordMatch) {
      throw new PasswordNotMatchError("Password not match.");
    }

    const accessToken = await this.jwtService.sign({
      sub: user.id,
    });
    const refreshToken = await this.generateRefreshToken({
      mode: "new",
      userId: user.id,
      accessToken: accessToken,
    });

    return {
      token_type: "Bearer",
      expires_in: this.expiresAt,
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  async refresh(refreshReqDto: RefreshReqDto): Promise<AuthResDto> {
    const auth = await this.authRepository.getOneAuth({
      refreshToken: refreshReqDto.refresh_token,
    });

    if (!auth) {
      throw new InvalidTokenError("Either token or refresh token is invalid");
    }

    if (auth.expiresAt.getTime() < new Date().getTime()) {
      throw new RefreshTokenExpiredError("Refresh token is expired.");
    }

    const accessToken = await this.jwtService.sign({
      sub: auth.user.id,
    });
    const refreshToken = await this.generateRefreshToken({
      mode: "update",
      prevAuthId: auth.id,
      userId: auth.user.id,
      accessToken: accessToken,
    });

    return {
      token_type: "Bearer",
      expires_in: this.expiresAt,
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  async logout(logoutReqDto: LogoutReqDto): Promise<LogoutResDto> {
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
    });

    return {
      success: true,
    };
  }
}

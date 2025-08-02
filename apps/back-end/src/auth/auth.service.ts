import { Injectable } from "@nestjs/common";
import { ConfigService } from "src/config/config.service";
import { JwtService } from "src/core/jwt.service";
import { Auth } from "src/entities/auth.entity";
import { User } from "src/entities/user.entity";
import { passwordHash, passwordVerify } from "src/lib/password";
import { generateRandomString } from "src/lib/string";
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
    const refreshToken = generateRandomString();

    // Add 30 days in milliseconds
    const expiresAt = new Date(
      Date.now() + this.configService.static.REFRESH_TOKEN_EXPIRES_AT * 1000,
    );

    const authUser = new User();
    authUser.id = params.userId;

    const auth = new Auth();
    auth.token = params.accessToken;
    auth.refreshToken = refreshToken;
    auth.expiresAt = expiresAt;
    auth.user = authUser;

    if (params.mode === "new") {
      await this.authRepository.saveAuth(auth);
    } else {
      await this.authRepository.updateAuth(
        {
          id: params.prevAuthId,
        },
        auth,
      );
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
      throw new UserNotFoundError();
    }

    const isPasswordMatch = await passwordVerify(
      user.password,
      loginReqDto.password,
    );

    if (!isPasswordMatch) {
      throw new PasswordNotMatchError();
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
      throw new InvalidTokenError();
    }

    if (auth.expiresAt.getTime() < new Date().getTime()) {
      throw new RefreshTokenExpiredError();
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
    const skipDeleted = true;
    await this.authRepository.deleteAuth(
      {
        token: logoutReqDto.token,
        user: {
          id: logoutReqDto.userId,
        },
      },
      skipDeleted,
    );

    return new LogoutResDto({
      success: true,
    });
  }

  async profile(profileReqDto: ProfileReqDto): Promise<ProfileResDto> {
    const user = await this.authRepository.getOneUser({
      id: profileReqDto.userId,
    });

    if (!user) {
      throw new UserNotFoundError();
    }

    return new ProfileResDto({
      userId: user.id,
      username: user.username,
    });
  }
}

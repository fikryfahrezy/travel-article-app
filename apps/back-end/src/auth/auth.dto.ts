import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { IsNotEmpty, IsOptional } from "class-validator";

export class RegisterReqDto {
  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  username: string;

  @ApiProperty()
  @IsNotEmpty()
  password: string;
}

export class LoginReqDto {
  @ApiProperty()
  @IsNotEmpty()
  username: string;

  @ApiProperty()
  @IsNotEmpty()
  password: string;
}

export class RefreshReqDto {
  @ApiPropertyOptional({ name: "refresh_token" })
  @IsOptional()
  @Expose({ name: "refresh_token" })
  refreshToken: string;
}

export class LogoutReqDto {
  userId: string;

  token: string;

  constructor(obj: LogoutReqDto) {
    this.userId = obj.userId;
    this.token = obj.token;
  }
}

export class AuthResDto {
  @ApiProperty({ name: "token_type", default: "Bearer" })
  @Expose({ name: "token_type" })
  tokenType: "Bearer";

  @ApiProperty({ name: "expires_in" })
  @Expose({ name: "expires_in" })
  expiresIn: number;

  @ApiProperty({ name: "access_token" })
  @IsNotEmpty()
  @Expose({ name: "access_token" })
  accessToken: string;

  @ApiProperty({ name: "refresh_token" })
  @IsNotEmpty()
  @Expose({ name: "refresh_token" })
  refreshToken: string;

  constructor(obj: AuthResDto) {
    this.tokenType = obj.tokenType;
    this.expiresIn = obj.expiresIn;
    this.accessToken = obj.accessToken;
    this.refreshToken = obj.refreshToken;
  }
}

export class LogoutResDto {
  success: boolean;

  constructor(obj: LogoutResDto) {
    this.success = obj.success;
  }
}

export class ProfileReqDto {
  userId: string;

  constructor(obj: ProfileReqDto) {
    this.userId = obj.userId;
  }
}

export class ProfileResDto {
  @ApiProperty({ name: "user_id" })
  @Expose({ name: "user_id" })
  userId: string;

  @ApiProperty()
  username: string;

  constructor(obj: ProfileResDto) {
    this.userId = obj.userId;
    this.username = obj.username;
  }
}

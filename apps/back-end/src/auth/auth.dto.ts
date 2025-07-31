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
  @ApiPropertyOptional()
  @IsOptional()
  @Expose({ name: "refresh_token" })
  refreshToken: string;
}

export class LogoutReqDto {
  @IsNotEmpty()
  userId: string;
}

export class AuthResDto {
  @ApiProperty({ default: "Bearer" })
  @Expose({ name: "token_type" })
  tokenType: "Bearer";

  @ApiProperty()
  @Expose({ name: "expires_in" })
  expiresIn: number;

  @ApiProperty()
  @IsNotEmpty()
  @Expose({ name: "access_token" })
  accessToken: string;

  @ApiProperty()
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
}

export class ProfileResDto {
  @ApiProperty()
  @Expose({ name: "user_id" })
  userId: string;

  @ApiProperty()
  username: string;

  constructor(obj: ProfileResDto) {
    this.userId = obj.userId;
    this.username = obj.username;
  }
}

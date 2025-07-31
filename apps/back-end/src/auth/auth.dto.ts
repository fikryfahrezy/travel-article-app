import { ApiProperty } from "@nestjs/swagger";
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
  @ApiProperty()
  @IsOptional()
  refresh_token: string;
}

export class LogoutReqDto {
  @IsNotEmpty()
  userId: string;
}

export class AuthResDto {
  @ApiProperty({ default: "Bearer" })
  token_type: "Bearer";

  @ApiProperty()
  expires_in: number;

  @ApiProperty()
  @IsNotEmpty()
  access_token: string;

  @ApiProperty()
  @IsNotEmpty()
  refresh_token: string;
}

export class LogoutResDto {
  success: boolean;
}

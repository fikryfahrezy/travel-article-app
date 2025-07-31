import { ApiProperty } from "@nestjs/swagger";
import z from "zod";

export const RegisterReqSchema = z.object({
  name: z.string(),
  username: z.string(),
  password: z.string(),
});

export class RegisterReqDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  username: string;

  @ApiProperty()
  password: string;
}

export const LoginReqSchema = z.object({
  username: z.string(),
  password: z.string(),
});

export class LoginReqDto {
  @ApiProperty()
  username: string;

  @ApiProperty()
  password: string;
}

export const RefreshReqSchema = z.object({
  refresh_token: z.string(),
});

export class RefreshReqDto {
  @ApiProperty()
  refresh_token: string;
}

export class LogoutReqDto {
  userId: string;
}

export class AuthResDto {
  @ApiProperty({ default: "Bearer" })
  token_type: "Bearer";

  @ApiProperty()
  expires_in: number;

  @ApiProperty()
  access_token: string;

  @ApiProperty()
  refresh_token: string;
}

export class LogoutResDto {
  success: boolean;
}

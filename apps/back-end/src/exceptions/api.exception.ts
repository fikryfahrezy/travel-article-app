import { HttpException, HttpStatus } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";

export class APIError extends HttpException {
  @ApiProperty()
  name: string;

  @ApiProperty()
  message: string;

  @ApiProperty()
  errors: string[];

  constructor(name: string, message: string, errors: string[], status: number) {
    super(message, status);
    this.name = name;
    this.message = message;
    this.errors = errors;
  }
}

export class UnauthorizedError extends APIError {
  constructor(message = "Unauthorized") {
    super("UnauthorizedError", message, [], HttpStatus.UNAUTHORIZED);
    this.name = "UnauthorizedError";
    this.message = message;
  }
}

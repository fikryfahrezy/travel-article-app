import { HttpException, HttpStatus } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";

export class APIException extends HttpException {
  @ApiProperty()
  name: string;

  @ApiProperty()
  message: string;

  @ApiProperty()
  errors: string[];
}

export class UnauthorizedError extends APIException {
  constructor(message = "Unauthorized") {
    super(message, HttpStatus.UNAUTHORIZED);
    this.name = "UnauthorizedError";
    this.message = message;
  }
}

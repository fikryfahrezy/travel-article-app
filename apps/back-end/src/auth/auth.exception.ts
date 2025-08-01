import { HttpStatus } from "@nestjs/common";
import { APIException } from "src/exceptions/api.exception";

export class UnhandledError extends APIException {
  constructor(message = "Unhandled") {
    super(message, HttpStatus.INTERNAL_SERVER_ERROR);
    this.name = "UnhandledError";
    this.message = message;
  }
}

export class DuplicateUsernameError extends APIException {
  constructor(message = "Duplicate Username") {
    super(message, HttpStatus.UNPROCESSABLE_ENTITY);
    this.name = "DuplicateUsernameError";
    this.message = message;
  }
}

export class UserNotFoundError extends APIException {
  constructor(message = "User Not Found") {
    super(message, HttpStatus.NOT_FOUND);
    this.name = "UserNotFoundError";
    this.message = message;
  }
}

export class PasswordNotMatchError extends APIException {
  constructor(message = "Password Not Match") {
    super(message, HttpStatus.BAD_REQUEST);
    this.name = "PasswordNotMatchError";
    this.message = message;
  }
}

export class InvalidTokenError extends APIException {
  constructor(message = "Invalid Token") {
    super(message, HttpStatus.BAD_REQUEST);
    this.name = "InvalidTokenError";
    this.message = message;
  }
}

export class RefreshTokenExpiredError extends APIException {
  constructor(message = "Refresh Token Expired") {
    super(message, HttpStatus.UNAUTHORIZED);
    this.name = "RefreshTokenExpiredError";
    this.message = message;
  }
}

export class AuthNotFoundError extends APIException {
  constructor(message = "Auth Not Found") {
    super(message, HttpStatus.NOT_FOUND);
    this.name = "AuthNotFoundError";
    this.message = message;
  }
}

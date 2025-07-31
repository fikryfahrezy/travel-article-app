import {
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
  UnprocessableEntityException,
} from "@nestjs/common";

export class UnhandledError extends InternalServerErrorException {
  constructor(message: string = "") {
    super(message);
    this.name = "UnhandledError";
    this.message = message || super.message;
  }
}

export class DuplicateUsernameError extends UnprocessableEntityException {
  constructor(message: string = "") {
    super(message);
    this.name = "DuplicateUsernameError";
    this.message = message || super.message;
  }
}

export class UserNotFoundError extends NotFoundException {
  constructor(message: string = "") {
    super(message);
    this.name = "UserNotFoundError";
    this.message = message || super.message;
  }
}

export class PasswordNotMatchError extends BadRequestException {
  constructor(message: string = "") {
    super(message);
    this.name = "PasswordNotMatchError";
    this.message = message || super.message;
  }
}

export class InvalidTokenError extends BadRequestException {
  constructor(message: string = "") {
    super(message);
    this.name = "InvalidTokenError";
    this.message = message || super.message;
  }
}

export class RefreshTokenExpiredError extends UnauthorizedException {
  constructor(message: string = "") {
    super(message);
    this.name = "RefreshTokenExpiredError";
    this.message = message || super.message;
  }
}

export class AuthNotFoundError extends NotFoundException {
  constructor(message: string = "") {
    super(message);
    this.name = "AuthNotFoundError";
    this.message = message || super.message;
  }
}

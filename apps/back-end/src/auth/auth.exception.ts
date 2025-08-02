import { DomainError } from "src/exceptions/domain.exception";

export class UnhandledError extends DomainError {
  constructor(message = "Unhandled") {
    super(message);
    this.name = "UnhandledError";
    this.message = message;
  }
}

export class DuplicateUsernameError extends DomainError {
  constructor(message = "Duplicate Username") {
    super(message);
    this.name = "DuplicateUsernameError";
    this.message = message;
  }
}

export class UserNotFoundError extends DomainError {
  constructor(message = "User Not Found") {
    super(message);
    this.name = "UserNotFoundError";
    this.message = message;
  }
}

export class PasswordNotMatchError extends DomainError {
  constructor(message = "Password Not Match") {
    super(message);
    this.name = "PasswordNotMatchError";
    this.message = message;
  }
}

export class InvalidTokenError extends DomainError {
  constructor(message = "Invalid Token") {
    super(message);
    this.name = "InvalidTokenError";
    this.message = message;
  }
}

export class RefreshTokenExpiredError extends DomainError {
  constructor(message = "Refresh Token Expired") {
    super(message);
    this.name = "RefreshTokenExpiredError";
    this.message = message;
  }
}

export class AuthNotFoundError extends DomainError {
  constructor(message = "Auth Not Found") {
    super(message);
    this.name = "AuthNotFoundError";
    this.message = message;
  }
}

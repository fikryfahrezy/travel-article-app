import {
  Catch,
  ExceptionFilter,
  HttpStatus,
  InternalServerErrorException,
} from "@nestjs/common";
import { APIError } from "src/exceptions/api.exception";
import {
  AuthNotFoundError,
  DuplicateUsernameError,
  InvalidTokenError,
  PasswordNotMatchError,
  RefreshTokenExpiredError,
  UserNotFoundError,
} from "./auth.exception";

@Catch()
export class AuthFilter implements ExceptionFilter {
  constructor() {}

  catch(exception: unknown): void {
    if (exception instanceof DuplicateUsernameError) {
      throw new APIError(
        exception.name,
        exception.message || "username already exist.",
        exception.errors,
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    if (exception instanceof UserNotFoundError) {
      throw new APIError(
        exception.name,
        exception.message || "user not found.",
        exception.errors,
        HttpStatus.NOT_FOUND,
      );
    }
    if (exception instanceof PasswordNotMatchError) {
      throw new APIError(
        exception.name,
        exception.message || "password not match.",
        exception.errors,
        HttpStatus.BAD_REQUEST,
      );
    }
    if (exception instanceof InvalidTokenError) {
      throw new APIError(
        exception.name,
        exception.message || "Either token or refresh token is invalid.",
        exception.errors,
        HttpStatus.BAD_REQUEST,
      );
    }
    if (exception instanceof RefreshTokenExpiredError) {
      throw new APIError(
        exception.name,
        exception.message || "refresh token is expired.",
        exception.errors,
        HttpStatus.UNAUTHORIZED,
      );
    }
    if (exception instanceof AuthNotFoundError) {
      throw new APIError(
        exception.name,
        exception.message || "auth not found.",
        exception.errors,
        HttpStatus.NOT_FOUND,
      );
    }

    if (exception instanceof Error) {
      throw exception;
    }

    throw new InternalServerErrorException();
  }
}

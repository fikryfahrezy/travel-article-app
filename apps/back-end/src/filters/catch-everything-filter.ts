import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { AbstractHttpAdapter } from "@nestjs/core";
import { ValidationError } from "src/exceptions/validation-error";

@Catch()
export class CatchEverythingFilter implements ExceptionFilter {
  constructor(private readonly httpAdapter: AbstractHttpAdapter) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();

    const errorName =
      exception instanceof Error ? exception.name : "UnknownError";

    const errorMessage =
      exception instanceof Error
        ? exception.message
        : "This error is unknown or unhandled";

    const fields = exception instanceof ValidationError ? exception.fields : {};

    const httpStatus =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const responseBody = {
      name: errorName,
      message: errorMessage,
      fields,
    };

    this.httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}

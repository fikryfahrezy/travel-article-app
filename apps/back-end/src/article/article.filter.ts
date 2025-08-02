import {
  Catch,
  ExceptionFilter,
  HttpStatus,
  InternalServerErrorException,
} from "@nestjs/common";
import { APIError } from "src/exceptions/api.exception";
import {
  ArticleCommentNotFoundError,
  ArticleNotFoundError,
  ArticleUserUniqueLikeError,
} from "./article.exception";

@Catch()
export class ArticleFilter implements ExceptionFilter {
  constructor() {}

  catch(exception: unknown): void {
    if (exception instanceof ArticleNotFoundError) {
      throw new APIError(
        exception.name,
        exception.message || "requested article not found",
        exception.errors,
        HttpStatus.NOT_FOUND,
      );
    }

    if (exception instanceof ArticleUserUniqueLikeError) {
      throw new APIError(
        exception.name,
        exception.message || "user already like the article",
        exception.errors,
        HttpStatus.BAD_REQUEST,
      );
    }
    if (exception instanceof ArticleCommentNotFoundError) {
      throw new APIError(
        exception.name,
        exception.message || "requested article comment not found",
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

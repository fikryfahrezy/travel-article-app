import { HttpStatus } from "@nestjs/common";
import { APIException } from "src/exceptions/api.exception";

export class ArticleNotFoundError extends APIException {
  constructor(message = "Article Not Found") {
    super(message, HttpStatus.NOT_FOUND);
    this.name = "ArticleNotFoundError";
    this.message = message;
  }
}

export class ArticleUserUniqueLikeError extends APIException {
  constructor(message = "Article User Unique Like") {
    super(message, HttpStatus.BAD_REQUEST);
    this.name = "ArticleUserUniqueLikeError";
    this.message = message;
  }
}

export class ArticleCommentNotFoundError extends APIException {
  constructor(message = "Article Comment Not Found") {
    super(message, HttpStatus.NOT_FOUND);
    this.name = "ArticleCommentNotFoundError";
    this.message = message;
  }
}

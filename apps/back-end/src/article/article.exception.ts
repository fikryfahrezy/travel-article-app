import { DomainError } from "src/exceptions/domain.exception";

export class ArticleNotFoundError extends DomainError {
  constructor(message = "Article Not Found") {
    super(message);
    this.name = "ArticleNotFoundError";
    this.message = message;
  }
}

export class ArticleUserUniqueLikeError extends DomainError {
  constructor(message = "Article User Unique Like") {
    super(message);
    this.name = "ArticleUserUniqueLikeError";
    this.message = message;
  }
}

export class ArticleCommentNotFoundError extends DomainError {
  constructor(message = "Article Comment Not Found") {
    super(message);
    this.name = "ArticleCommentNotFoundError";
    this.message = message;
  }
}

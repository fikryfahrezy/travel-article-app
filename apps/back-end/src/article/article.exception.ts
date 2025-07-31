import { NotFoundException } from "@nestjs/common";

export class ArticleNotFoundError extends NotFoundException {
  constructor(message: string = "") {
    super(message);
    this.name = "ArticleNotFoundError";
    this.message = message || super.message;
  }
}

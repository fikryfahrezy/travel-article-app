import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ArticleLike } from "src/entities/article-like.entity";
import { Article } from "src/entities/article.entity";
import { Comment } from "src/entities/comment.entity";
import { ArticleController } from "./article.controller";
import { ArticleRepository } from "./article.repository";
import { ArticleService } from "./article.service";

@Module({
  imports: [TypeOrmModule.forFeature([Article, Comment, ArticleLike])],
  controllers: [ArticleController],
  providers: [ArticleService, ArticleRepository],
})
export class ArticleModule {}

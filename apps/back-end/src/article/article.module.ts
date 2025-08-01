import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ArticleComment } from "src/entities/article-comment.entity";
import { ArticleLike } from "src/entities/article-like.entity";
import { Article } from "src/entities/article.entity";
import { ArticleController } from "./article.controller";
import { ArticleRepository } from "./article.repository";
import { ArticleService } from "./article.service";

@Module({
  imports: [TypeOrmModule.forFeature([Article, ArticleComment, ArticleLike])],
  controllers: [ArticleController],
  providers: [ArticleService, ArticleRepository],
})
export class ArticleModule {}

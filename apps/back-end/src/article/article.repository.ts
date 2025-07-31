import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UnhandledError } from "src/auth/auth.exception";
import { ArticleLike } from "src/entities/article-like.entity";
import { Article } from "src/entities/article.entity";
import { Comment } from "src/entities/comment.entity";
import { DataSource, DeepPartial, FindOptionsWhere, Repository } from "typeorm";
import { CursorReqDto } from "./article.dto";
import { ArticleNotFoundError } from "./article.exception";

@Injectable()
export class ArticleRepository {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(Article)
    private articleRepository: Repository<Article>,
    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,
    @InjectRepository(ArticleLike)
    private articleLikeRepository: Repository<ArticleLike>,
  ) {}

  async runQuery<
    TCallback extends () => Promise<unknown>,
    TReturn extends Awaited<ReturnType<TCallback>>,
  >(callback: TCallback): Promise<TReturn> {
    try {
      return (await callback()) as TReturn;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }

      throw new UnhandledError();
    }
  }

  async saveArticle(
    article: DeepPartial<Article>,
  ): Promise<Pick<Article, "id">> {
    return await this.runQuery(async () => {
      return await this.articleRepository.save(article);
    });
  }

  async getAllArticle(userId: string, cursorReqDto: CursorReqDto) {
    const { limit, date, identifer } = cursorReqDto;

    const query = this.articleRepository
      .createQueryBuilder("article")
      .select([
        "article.id AS id",
        "article.title AS title",
        "article.slug AS slug",
        "article.created_at AS created_at",
        "article.updated_at AS updated_at",
        "article.author_id AS author_id",
        "CASE WHEN article_like.user_id IS NOT NULL THEN true ELSE false END AS liked",
      ])
      .leftJoin(
        ArticleLike,
        "article_like",
        "article_like.article_id = article.id AND article_like.user_id = :userId",
        { userId },
      )
      .orderBy("article.created_at", "DESC")
      .addOrderBy("article.id", "DESC")
      .limit(limit);

    if (identifer && date) {
      query.where(
        "(article.created_at, article.id) > (:createdAt, :identifer)",
        {
          identifer,
          createdAt: date,
        },
      );
    }

    return await this.runQuery(async () => {
      type ReturnType = Pick<Article, "id" | "title" | "slug"> & {
        created_at: Article["createdAt"];
        updated_at: Article["updatedAt"];
        liked: boolean;
        author_id: string;
      };
      return await query.getRawMany<ReturnType>();
    });
  }

  async getOneArticleById(articleId: string, userId: string) {
    const query = this.articleRepository
      .createQueryBuilder("article")
      .select([
        "article.id AS id",
        "article.title AS title",
        "article.slug AS slug",
        "article.content AS content",
        "article.created_at AS created_at",
        "article.updated_at AS updated_at",
        "article.author_id AS author_id",
        "CASE WHEN article_like.user_id IS NOT NULL THEN true ELSE false END AS liked",
      ])
      .leftJoin(
        ArticleLike,
        "article_like",
        "article_like.article_id = article.id AND article_like.user_id = :userId",
        { userId },
      )
      .where("article.id = :articleId", {
        articleId,
      });

    return await this.runQuery(async () => {
      type ReturnType = Pick<Article, "id" | "title" | "slug" | "content"> & {
        created_at: Article["createdAt"];
        updated_at: Article["updatedAt"];
        liked: boolean;
        author_id: string;
      };
      return await query.getRawOne<ReturnType>();
    });
  }

  async updateArticle(
    criteria: FindOptionsWhere<Article>,
    article: DeepPartial<Article>,
  ) {
    const result = await this.runQuery(async () => {
      return await this.articleRepository.update(criteria, article);
    });
    if (result.affected === 0) {
      throw new ArticleNotFoundError();
    }
  }

  async deleteArticle(criteria: FindOptionsWhere<Article>) {
    const result = await this.runQuery(async () => {
      return await this.articleRepository.update(criteria, {
        deletedAt: new Date(),
      });
    });
    if (result.affected === 0) {
      throw new ArticleNotFoundError();
    }
  }

  async saveComment(
    comment: DeepPartial<Comment>,
  ): Promise<Pick<Comment, "id">> {
    return await this.runQuery(async () => {
      return await this.commentRepository.save(comment);
    });
  }

  async getAllComment(cursorReqDto: CursorReqDto) {
    const { limit, date, identifer } = cursorReqDto;

    const query = this.dataSource
      .getRepository(Comment)
      .createQueryBuilder("comment")
      .select([
        "comment.id AS id",
        "comment.content AS content",
        "comment.created_at AS created_at",
        "comment.updated_at AS updated_at",
      ])
      .orderBy("comment.created_at", "DESC")
      .addOrderBy("comment.id", "DESC")
      .limit(limit);

    if (identifer && date) {
      query.where(
        "(comment.created_at, comment.id) > (:createdAt, :identifer)",
        {
          identifer,
          createdAt: date,
        },
      );
    }

    return await this.runQuery(async () => {
      type ReturnType = Pick<Comment, "id" | "content"> & {
        created_at: Comment["createdAt"];
        updated_at: Comment["updatedAt"];
      };

      return await query.getRawMany<ReturnType>();
    });
  }

  async getOneComment(commentFields: FindOptionsWhere<Comment>) {
    return await this.runQuery(async () => {
      return await this.commentRepository.findOne({
        where: commentFields,
      });
    });
  }

  async deleteComment(comment: FindOptionsWhere<Comment>) {
    return await this.runQuery(async () => {
      return await this.commentRepository.softDelete(comment);
    });
  }

  async saveArticleLike(articleLike: DeepPartial<ArticleLike>) {
    return await this.runQuery(async () => {
      return await this.articleLikeRepository.save(articleLike);
    });
  }

  async deleteArticleLike(articleLike: FindOptionsWhere<ArticleLike>) {
    return await this.runQuery(async () => {
      return await this.articleLikeRepository.softDelete(articleLike);
    });
  }
}

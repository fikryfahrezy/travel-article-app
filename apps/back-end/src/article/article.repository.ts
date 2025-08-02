import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { isUUID } from "class-validator";
import { UnhandledError } from "src/auth/auth.exception";
import { ArticleComment } from "src/entities/article-comment.entity";
import { ArticleLike } from "src/entities/article-like.entity";
import { Article } from "src/entities/article.entity";
import { User } from "src/entities/user.entity";
import { isUniqueConstraintViolationError } from "src/lib/error-assertion";
import {
  DataSource,
  DeepPartial,
  FindOptionsWhere,
  IsNull,
  Repository,
} from "typeorm";
import { PaginationReqDto } from "./article.dto";
import {
  ArticleCommentNotFoundError,
  ArticleNotFoundError,
  ArticleUserUniqueLikeError,
} from "./article.exception";

@Injectable()
export class ArticleRepository {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(Article)
    private articleRepository: Repository<Article>,
    @InjectRepository(ArticleComment)
    private articleCommentRepository: Repository<ArticleComment>,
    @InjectRepository(ArticleLike)
    private articleLikeRepository: Repository<ArticleLike>,
  ) {}

  async runQuery<
    TCallback extends () => Promise<unknown>,
    TReturn extends Awaited<ReturnType<TCallback>>,
  >(callback: TCallback): Promise<TReturn | Error> {
    try {
      return (await callback()) as TReturn;
    } catch (error) {
      if (
        isUniqueConstraintViolationError(
          error,
          "article_likes_articles_users_unique",
        )
      ) {
        return new ArticleUserUniqueLikeError();
      }

      if (error instanceof Error) {
        return error;
      }

      return new UnhandledError();
    }
  }

  async saveArticle(article: DeepPartial<Article>) {
    return await this.runQuery(async () => {
      return await this.articleRepository.save(article);
    });
  }

  async getAllArticle(userId: string, paginationReqDto: PaginationReqDto) {
    const { limit, page } = paginationReqDto;

    const offset = page > 0 ? (page - 1) * limit : 0;
    const query = this.articleRepository
      .createQueryBuilder("article")
      .select([
        "(COUNT(article.id) OVER ())::int AS total",
        "article.id AS id",
        "article.title AS title",
        "article.slug AS slug",
        "article.created_at AS created_at",
        "article.updated_at AS updated_at",
        "article.author_id AS author_id",
        "author.username AS author_username",
        userId
          ? "CASE WHEN article_like.user_id IS NOT NULL THEN true ELSE false END AS liked"
          : "false AS liked",
      ]);

    if (userId) {
      query.leftJoin(
        ArticleLike,
        "article_like",
        "article_like.article_id = article.id AND article_like.user_id = :userId",
        { userId },
      );
    }

    query
      .leftJoin(User, "author", "author.id = article.author_id")
      .where("article.deleted_at IS NULL")
      .orderBy("article.created_at", "DESC")
      .offset(offset)
      .limit(limit);

    return await this.runQuery(async () => {
      type ReturnType = Pick<Article, "id" | "title" | "slug"> & {
        total: number;
        created_at: Article["createdAt"];
        updated_at: Article["updatedAt"];
        liked: boolean;
        author_id: string;
        author_username: string;
      };
      return await query.getRawMany<ReturnType>();
    });
  }

  async getOneArticle(criteria: FindOptionsWhere<Article>) {
    return await this.runQuery(async () => {
      return await this.articleRepository.findOne({
        where: criteria,
      });
    });
  }

  async getOneArticleBySlug(articleIdOrSlug: string, userId: string) {
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
        "author.username AS author_username",
        userId
          ? "CASE WHEN article_like.user_id IS NOT NULL THEN true ELSE false END AS liked"
          : "false AS liked",
      ]);

    if (userId) {
      query.leftJoin(
        ArticleLike,
        "article_like",
        "article_like.article_id = article.id AND article_like.deleted_at IS NULL AND article_like.user_id = :userId",
        { userId },
      );
    }

    query
      .leftJoin(User, "author", "author.id = article.author_id")
      .where("article.deleted_at IS NULL");

    if (isUUID(articleIdOrSlug)) {
      query.where("article.id = :articleIdOrSlug", {
        articleIdOrSlug,
      });
    } else {
      query.where("article.slug = :articleIdOrSlug", {
        articleIdOrSlug,
      });
    }

    return await this.runQuery(async () => {
      type ReturnType = Pick<Article, "id" | "title" | "slug" | "content"> & {
        created_at: Article["createdAt"];
        updated_at: Article["updatedAt"];
        liked: boolean;
        author_id: string;
        author_username: string;
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

    if (result instanceof Error) {
      return result;
    }

    if (result.affected === 0) {
      return new ArticleNotFoundError();
    }
  }

  async deleteArticle(criteria: FindOptionsWhere<Article>, skipDeleted = true) {
    const result = await this.runQuery(async () => {
      return await this.articleRepository.softDelete({
        ...criteria,
        ...(skipDeleted
          ? {
              deletedAt: IsNull(),
            }
          : {}),
      });
    });

    if (result instanceof Error) {
      return result;
    }

    if (result.affected === 0) {
      return new ArticleNotFoundError();
    }
  }

  async saveArticleComment(comment: DeepPartial<ArticleComment>) {
    return await this.runQuery(async () => {
      return await this.articleCommentRepository.save(comment);
    });
  }

  async getAllArticleComment(
    articleId: string,
    paginationReqDto: PaginationReqDto,
  ) {
    const { limit, page } = paginationReqDto;

    const offset = page > 0 ? (page - 1) * limit : 0;
    const query = this.dataSource
      .getRepository(ArticleComment)
      .createQueryBuilder("article_comment")
      .select([
        "(COUNT(article_comment.id) OVER ())::int AS total",
        "article_comment.id AS id",
        "article_comment.content AS content",
        "article_comment.article_id AS article_id",
        "article.title AS article_title",
        "article.slug AS article_slug",
        "article.author_id AS article_author_id",
        "article_author.username AS article_author_username",
        "article_comment.author_id AS author_id",
        "comment_author.username AS author_username",
        "article_comment.created_at AS created_at",
        "article_comment.updated_at AS updated_at",
      ])
      .leftJoin(Article, "article", "article.id = article_comment.article_id")
      .leftJoin(User, "article_author", "article_author.id = article.author_id")
      .leftJoin(
        User,
        "comment_author",
        "comment_author.id = article_comment.author_id",
      )
      .where("article.deleted_at IS NULL")
      .andWhere("article_comment.article_id = :articleId", { articleId })
      .orderBy("article_comment.created_at", "DESC")
      .offset(offset)
      .limit(limit);

    return await this.runQuery(async () => {
      type ReturnType = Pick<ArticleComment, "id" | "content"> & {
        total: number;
        article_id: ArticleComment["article"]["id"];
        article_title: ArticleComment["article"]["title"];
        article_slug: ArticleComment["article"]["slug"];
        article_author_id: ArticleComment["article"]["author"]["id"];
        article_author_username: User["username"];
        author_id: ArticleComment["author"]["id"];
        author_username: User["username"];
        created_at: ArticleComment["createdAt"];
        updated_at: ArticleComment["updatedAt"];
      };

      return await query.getRawMany<ReturnType>();
    });
  }

  async getOneArticleCommentById(id: string) {
    const query = this.dataSource
      .getRepository(ArticleComment)
      .createQueryBuilder("article_comment")
      .select([
        "(COUNT(article_comment.id) OVER ())::int AS total",
        "article_comment.id AS id",
        "article_comment.content AS content",
        "article_comment.article_id AS article_id",
        "article.title AS article_title",
        "article.content AS article_content",
        "article.slug AS article_slug",
        "article.author_id AS article_author_id",
        "article_author AS article_author_username",
        "article_comment.author_id AS author_id",
        "comment_author.username AS author_username",
        "article_comment.created_at AS created_at",
        "article_comment.updated_at AS updated_at",
      ])
      .leftJoin(Article, "article", "article.id = article_comment.article_id")
      .leftJoin(User, "article_author", "article_author.id = article.author_id")
      .leftJoin(
        User,
        "comment_author",
        "comment_author.id = article_comment.author_id",
      )
      .where("article.deleted_at IS NULL")
      .andWhere("article_comment.id = :id", { id });

    return await this.runQuery(async () => {
      type ReturnType = Pick<ArticleComment, "id" | "content"> & {
        total: number;
        article_id: ArticleComment["article"]["id"];
        article_title: ArticleComment["article"]["title"];
        article_slug: ArticleComment["article"]["slug"];
        article_author_id: ArticleComment["article"]["author"]["id"];
        article_author_username: User["username"];
        author_id: ArticleComment["author"]["id"];
        author_username: User["username"];
        created_at: ArticleComment["createdAt"];
        updated_at: ArticleComment["updatedAt"];
      };

      return await query.getRawOne<ReturnType>();
    });
  }

  async updateArticleComment(
    criteria: FindOptionsWhere<ArticleComment>,
    articleComment: DeepPartial<ArticleComment>,
  ) {
    const result = await this.runQuery(async () => {
      return await this.articleCommentRepository.update(
        criteria,
        articleComment,
      );
    });

    if (result instanceof Error) {
      return result;
    }

    if (result.affected === 0) {
      return new ArticleCommentNotFoundError();
    }
  }

  async deleteArticleComment(
    criteria: FindOptionsWhere<ArticleComment>,
    skipDeleted = true,
  ) {
    const result = await this.runQuery(async () => {
      return await this.articleCommentRepository.softDelete({
        ...criteria,
        ...(skipDeleted
          ? {
              deletedAt: IsNull(),
            }
          : {}),
      });
    });

    if (result instanceof Error) {
      return result;
    }

    if (result.affected === 0) {
      return new ArticleCommentNotFoundError();
    }
  }

  async upsertArticleLike(articleLike: DeepPartial<ArticleLike>) {
    return await this.runQuery(async () => {
      return await this.articleLikeRepository.upsert(articleLike, {
        conflictPaths: {
          user: true,
          article: true,
        },
      });
    });
  }
}

import { Injectable } from "@nestjs/common";
import { ArticleComment } from "src/entities/article-comment.entity";
import { ArticleLike } from "src/entities/article-like.entity";
import { Article } from "src/entities/article.entity";
import { User } from "src/entities/user.entity";
import {
  AuthReqDto,
  CreateArticleCommentReqDto,
  CreateArticleReqDto,
  DeleteArticleCommentReqDto,
  DeleteArticleReqDto,
  GetAllArticleCommentItemResDto,
  GetAllArticleCommentReqDto,
  GetAllArticleCommentResDto,
  GetAllArticleItemResDto,
  GetAllArticleResDto,
  GetArticleCommentReqDto,
  GetArticleCommentResDto,
  GetArticleReqDto,
  GetArticleResDto,
  LikeArticleReqDto,
  MutationResDto,
  PaginationReqDto,
  UpdateArticleCommentReqDto,
  UpdateArticleReqDto,
} from "./article.dto";
import {
  ArticleCommentNotFoundError,
  ArticleNotFoundError,
} from "./article.exception";
import { ArticleRepository } from "./article.repository";

@Injectable()
export class ArticleService {
  constructor(private articleRespository: ArticleRepository) {}

  async createArticle(
    auth: AuthReqDto,
    createArticleReqDto: CreateArticleReqDto,
  ): Promise<MutationResDto> {
    const author = new User();
    author.id = auth.userId;

    const newArticle = new Article();
    newArticle.title = createArticleReqDto.title;
    newArticle.content = createArticleReqDto.content;
    newArticle.author = author;

    const result = await this.articleRespository.saveArticle(newArticle);
    if (result instanceof Error) {
      throw result;
    }

    return new MutationResDto({
      id: newArticle.id,
    });
  }

  async getAllArticle(
    auth: AuthReqDto,
    paginationReqDto: PaginationReqDto,
  ): Promise<GetAllArticleResDto> {
    const articles = await this.articleRespository.getAllArticle(
      auth.userId,
      paginationReqDto,
    );

    if (articles instanceof Error) {
      throw articles;
    }

    const totalData = articles[0]?.total || 0;
    const data = articles.map((article) => {
      return new GetAllArticleItemResDto({
        id: article.id,
        title: article.title,
        slug: article.slug,
        liked: article.liked,
        authorId: article.author_id,
        authorUsername: article.author_username,
        createdAt: article.created_at,
        updatedAt: article.updated_at,
      });
    });

    return new GetAllArticleResDto({
      data,
      totalData,
      limit: paginationReqDto.limit,
      page: paginationReqDto.page,
    });
  }

  async getArticle(
    auth: AuthReqDto,
    getArticleReqDto: GetArticleReqDto,
  ): Promise<GetArticleResDto> {
    const article = await this.articleRespository.getOneArticleBySlug(
      getArticleReqDto.articleIdOrSlug,
      auth.userId,
    );

    if (article instanceof Error) {
      throw article;
    }

    if (!article) {
      throw new ArticleNotFoundError();
    }

    return new GetArticleResDto({
      id: article.id,
      title: article.title,
      slug: article.slug,
      liked: article.liked,
      content: article.content,
      authorId: article.author_id,
      authorUsername: article.author_username,
      createdAt: article.created_at,
      updatedAt: article.updated_at,
    });
  }

  async updateArticle(
    auth: AuthReqDto,
    updateArticleReqDto: UpdateArticleReqDto,
  ): Promise<MutationResDto> {
    const updatedArticle = new Article();
    updatedArticle.title = updateArticleReqDto.title;
    updatedArticle.content = updateArticleReqDto.content;

    const result = await this.articleRespository.updateArticle(
      { id: updateArticleReqDto.articleId, author: { id: auth.userId } },
      updatedArticle,
    );
    if (result instanceof Error) {
      throw result;
    }

    return new MutationResDto({
      id: updateArticleReqDto.articleId,
    });
  }

  async deleteArticle(
    auth: AuthReqDto,
    deleteArticleReqDto: DeleteArticleReqDto,
  ): Promise<MutationResDto> {
    const skipDeleted = true;
    const result = await this.articleRespository.deleteArticle(
      {
        id: deleteArticleReqDto.articleId,
        author: { id: auth.userId },
      },
      skipDeleted,
    );
    if (result instanceof Error) {
      throw result;
    }

    return new MutationResDto({
      id: deleteArticleReqDto.articleId,
    });
  }

  async likeArticle(
    auth: AuthReqDto,
    likeArticleReqDto: LikeArticleReqDto,
  ): Promise<MutationResDto> {
    const article = new Article();
    article.id = likeArticleReqDto.articleId;

    const user = new User();
    user.id = auth.userId;

    const articleLike = new ArticleLike();
    articleLike.article = article;
    articleLike.user = user;

    let result: unknown = null;
    if (likeArticleReqDto.like) {
      const existingArticle = await this.articleRespository.getOneArticle({
        id: likeArticleReqDto.articleId,
      });

      if (!existingArticle) {
        throw new ArticleNotFoundError();
      }

      articleLike.deletedAt = null;
      result = await this.articleRespository.upsertArticleLike(articleLike);
    } else {
      articleLike.deletedAt = new Date();
      result = await this.articleRespository.upsertArticleLike(articleLike);
    }

    if (result instanceof Error) {
      throw result;
    }

    return new MutationResDto({
      id: articleLike.id,
    });
  }

  async createArticleComment(
    auth: AuthReqDto,
    createArticleCommentReqDto: CreateArticleCommentReqDto,
  ): Promise<MutationResDto> {
    const article = new Article();
    article.id = createArticleCommentReqDto.articleId;

    const author = new User();
    author.id = auth.userId;

    const newComment = new ArticleComment();
    newComment.content = createArticleCommentReqDto.content;
    newComment.author = author;
    newComment.article = article;

    const result = await this.articleRespository.saveArticleComment(newComment);
    if (result instanceof Error) {
      throw result;
    }

    return new MutationResDto({
      id: newComment.id,
    });
  }

  async getAllArticleComment(
    getAllArticleCommentReqDto: GetAllArticleCommentReqDto,
  ): Promise<GetAllArticleCommentResDto> {
    const articles = await this.articleRespository.getAllArticleComment(
      getAllArticleCommentReqDto.articleId,
      getAllArticleCommentReqDto.pagination,
    );

    if (articles instanceof Error) {
      throw articles;
    }

    const totalData = articles[0]?.total || 0;
    const data = articles.map((comment) => {
      return new GetAllArticleCommentItemResDto({
        id: comment.id,
        articleId: comment.article_id,
        articleTitle: comment.article_title,
        articleSlug: comment.article_slug,
        articleAuthorId: comment.article_author_id,
        articleAuthorUsername: comment.article_author_username,
        authorId: comment.author_id,
        authorUsername: comment.author_username,
        content: comment.content,
        createdAt: comment.created_at,
        updatedAt: comment.updated_at,
      });
    });

    return new GetAllArticleCommentResDto({
      data,
      totalData,
      limit: getAllArticleCommentReqDto.pagination.limit,
      page: getAllArticleCommentReqDto.pagination.page,
    });
  }

  async getArticleComment(
    getArticleCommentReqDto: GetArticleCommentReqDto,
  ): Promise<GetArticleCommentResDto> {
    const comment = await this.articleRespository.getOneArticleCommentById(
      getArticleCommentReqDto.commentId,
    );

    if (comment instanceof Error) {
      throw comment;
    }

    if (!comment) {
      throw new ArticleCommentNotFoundError();
    }

    return new GetArticleCommentResDto({
      id: comment.id,
      articleId: comment.article_id,
      articleTitle: comment.article_title,
      articleSlug: comment.article_slug,
      articleAuthorId: comment.article_author_id,
      articleAuthorUsername: comment.article_author_username,
      authorId: comment.author_id,
      authorUsername: comment.author_username,
      content: comment.content,
      createdAt: comment.created_at,
      updatedAt: comment.updated_at,
    });
  }

  async updateArticleComment(
    auth: AuthReqDto,
    updateArticleCommentReqDto: UpdateArticleCommentReqDto,
  ): Promise<MutationResDto> {
    const updatedArticleComment = new ArticleComment();
    updatedArticleComment.content = updateArticleCommentReqDto.content;

    const result = await this.articleRespository.updateArticleComment(
      { id: updateArticleCommentReqDto.commentId, author: { id: auth.userId } },
      updatedArticleComment,
    );
    if (result instanceof Error) {
      throw result;
    }

    return new MutationResDto({
      id: updateArticleCommentReqDto.commentId,
    });
  }

  async deleteArticleComment(
    auth: AuthReqDto,
    deleteArticleCommentReqDto: DeleteArticleCommentReqDto,
  ): Promise<MutationResDto> {
    const skipDeleted = true;
    const result = await this.articleRespository.deleteArticleComment(
      {
        id: deleteArticleCommentReqDto.commentId,
        author: { id: auth.userId },
      },
      skipDeleted,
    );

    if (result instanceof Error) {
      throw result;
    }

    return new MutationResDto({
      id: deleteArticleCommentReqDto.commentId,
    });
  }
}

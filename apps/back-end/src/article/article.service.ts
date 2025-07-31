import { Injectable } from "@nestjs/common";
import { Article } from "src/entities/article.entity";
import { User } from "src/entities/user.entity";
import {
  AuthReqDto,
  CreateArticleCommentReqDto,
  CreateArticleReqDto,
  CursorReqDto,
  DeleteArticleCommentReqDtoDto,
  DeleteArticleReqDto,
  GetAllArticleCommentReqDto,
  GetAllArticleResDto,
  GetArticleCommentReqDto,
  GetArticleReqDto,
  GetArticleResDto,
  LikeArticleReqDto,
  MutationResDto,
  UpdateArticleCommentReqDto,
  UpdateArticleReqDto,
} from "./article.dto";
import { ArticleNotFoundError } from "./article.exception";
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

    await this.articleRespository.saveArticle(newArticle);

    return new MutationResDto({
      id: newArticle.id,
    });
  }

  async getAllArticle(
    auth: AuthReqDto,
    cursorReqDto: CursorReqDto,
  ): Promise<GetAllArticleResDto[]> {
    const articles = await this.articleRespository.getAllArticle(
      auth.userId,
      cursorReqDto,
    );

    return articles.map((article) => {
      return new GetAllArticleResDto({
        id: article.id,
        title: article.title,
        slug: article.slug,
        liked: article.liked,
        authorId: article.author_id,
        createdAt: article.created_at,
        updatedAt: article.updated_at,
      });
    });
  }

  async getArticle(
    auth: AuthReqDto,
    getArticleReqDto: GetArticleReqDto,
  ): Promise<GetArticleResDto> {
    const article = await this.articleRespository.getOneArticleById(
      getArticleReqDto.articleId,
      auth.userId,
    );

    if (!article) {
      throw new ArticleNotFoundError("Requested article not found.");
    }

    return new GetArticleResDto({
      id: article.id,
      title: article.title,
      slug: article.slug,
      liked: article.liked,
      authorId: article.author_id,
      createdAt: article.created_at,
      updatedAt: article.updated_at,
    });
  }

  async updateArticle(
    auth: AuthReqDto,
    updateArticleReqDto: UpdateArticleReqDto,
  ): Promise<MutationResDto> {
    const author = new User();
    author.id = auth.userId;

    const updatedArticle = new Article();
    updatedArticle.title = updateArticleReqDto.title;
    updatedArticle.content = updateArticleReqDto.content;

    await this.articleRespository.updateArticle(
      { id: updateArticleReqDto.articleId, author: author },
      updatedArticle,
    );

    return new MutationResDto({
      id: updatedArticle.id,
    });
  }

  deleteArticle(_: AuthReqDto, __: DeleteArticleReqDto): MutationResDto {
    return new MutationResDto({
      id: "",
    });
  }

  likeArticle(_: AuthReqDto, __: LikeArticleReqDto): MutationResDto {
    return new MutationResDto({
      id: "",
    });
  }

  createArticleComment(
    _: AuthReqDto,
    __: CreateArticleCommentReqDto,
  ): MutationResDto {
    return new MutationResDto({
      id: "",
    });
  }

  getAllArticleComment(
    _: AuthReqDto,
    __: GetAllArticleCommentReqDto,
  ): MutationResDto {
    return new MutationResDto({
      id: "",
    });
  }

  getArticleComment(
    _: AuthReqDto,
    __: GetArticleCommentReqDto,
  ): MutationResDto {
    return new MutationResDto({
      id: "",
    });
  }

  updateArticleComment(
    _: AuthReqDto,
    __: UpdateArticleCommentReqDto,
  ): MutationResDto {
    return new MutationResDto({
      id: "",
    });
  }

  deleteArticleComment(
    _: AuthReqDto,
    __: DeleteArticleCommentReqDtoDto,
  ): MutationResDto {
    return new MutationResDto({
      id: "",
    });
  }
}
